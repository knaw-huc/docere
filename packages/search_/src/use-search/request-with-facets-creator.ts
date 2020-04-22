import { SortBy, SortDirection, FacetedSearchContext } from '@docere/common'

import { isBooleanFacetData, isListFacetData, isRangeFacetData, isDateFacetData, isHierarchyFacetData, getChildFieldName } from '../utils'
import ESRequest from './request-creator'

import type { ElasticSearchRequestOptions, ListFacetData, BooleanFacetData, HierarchyFacetData, RangeFacetData, DateFacetData } from '@docere/common'

interface AggregationRequest {
	aggs: any
	filter?: any
}

type Aggregations = { [id: string]: AggregationRequest }
type Highlight = { fields: { text: {} }, require_field_match: boolean }

interface ListAggregationTerms {
	field: string
	include?: string
	order?: { [sb in SortBy]?: SortDirection }
	size: number
}

export default class ESRequestWithFacets extends ESRequest {
	aggs: Aggregations = {}
	highlight: Highlight
	post_filter: Record<string, any>
	query: Record<string, any>

	constructor(options: ElasticSearchRequestOptions, context: FacetedSearchContext) {
		super(options, context)

		if (options.facetsData == null) return

		this.setPostFilter(options)
		this.setAggregations(options)
		this.setQuery(options)
	}

	private setPostFilter(options: ElasticSearchRequestOptions) {
		function toPostFilter(facet: ListFacetData | BooleanFacetData) {
			const allFacetFilters = [...facet.filters].map(key => ({ term: { [facet.config.id]: key } }))
			if (allFacetFilters.length === 1) return allFacetFilters[0]
			else if (allFacetFilters.length > 1) return { bool: { should: allFacetFilters } }
			return {}
		}

		function toHierarchyPostFilter(facetData: HierarchyFacetData) {
			const allFacetFilters = [...facetData.filters].map((key, index) => {
				const field = index === 0 ?
					facetData.config.id :
					getChildFieldName(facetData.config.id, index)
				return { term: { [field]: key } }
			})
			if (allFacetFilters.length === 1) return allFacetFilters[0]
			else if (allFacetFilters.length > 1) return { bool: { must: allFacetFilters } }
			return {}
		}

		const facetsData = Array.from(options.facetsData.values())

		const BooleanAndListPostFilters = facetsData
			.filter(facet => (isBooleanFacetData(facet) || isListFacetData(facet)) && facet.filters.size) // Only set post_filter where facet has filters (check if Set is empty)
			.map((facet: ListFacetData | BooleanFacetData) => toPostFilter(facet))

		const HierarchyPostFilters = facetsData
			.filter(facet => isHierarchyFacetData(facet) && facet.filters.size) // Only set post_filter where facet has filters (check if Set is empty)
			.map(toHierarchyPostFilter)

		const DatePostFilters = facetsData
			.filter(isDateFacetData)
			.filter(facetData => facetData.filters != null)
			.map(facet => ({
				range: {
					[facet.config.id]: {
						gte: new Date(facet.filters.from).toISOString(),
						lte: facet.filters.to != null ? new Date(facet.filters.to).toISOString() : null
					}
				}
			}))

		const RangePostFilters = facetsData
			.filter(isRangeFacetData)
			.filter((facetData: RangeFacetData) => facetData.filters != null)
			.map((facet: RangeFacetData) => ({
				range: {
					[facet.config.id]: {
						gte: facet.filters.from,
						lte: facet.filters.to != null ? facet.filters.to : null
					}
				}
			}))


		const post_filters = BooleanAndListPostFilters
			.concat(DatePostFilters as any[])
			.concat(RangePostFilters as any[])
			.concat(HierarchyPostFilters as any[])

		if (post_filters.length === 1) {
			this.post_filter = post_filters[0]
		} else if (post_filters.length > 1) {
			this.post_filter = {
				bool: {
					must: post_filters
				}
			}
		}
	}

	private setAggregations(options: ElasticSearchRequestOptions) {
		for (const facetData of options.facetsData.values()) {
			let facetAggs	
			if (isBooleanFacetData(facetData)) facetAggs = this.createBooleanAggregation(facetData)
			if (isDateFacetData(facetData)) facetAggs = this.createDateHistogramAggregation(facetData)
			if (isHierarchyFacetData(facetData)) facetAggs = this.createHierarchyAggregation(facetData)
			if (isListFacetData(facetData)) facetAggs = this.createListAggregation(facetData)
			if (isRangeFacetData(facetData)) facetAggs = this.createHistogramAggregation(facetData)

			if (facetAggs != null) {
				this.aggs = {
					...this.aggs,
					...facetAggs
				}
			}
		}
	}

	private addFilter(key: string, values: any): any {
		const agg = {
			[key]: {
				aggs: { [key]: values },
				filter: { match_all: {} }
			}
		}

		if (this.post_filter != null) {
			// @ts-ignore
			agg[key].filter = this.post_filter
		}

		return agg
	}

	private addHierarchyFilter(key: string, filter: string, values: any): any {
		// console.log(key, filter)
		const agg = {
			[key]: {
				aggs: { [key]: values },
				filter: { match_all: {} }
			}
		}

		if (filter != null) {
			// @ts-ignore
			agg[key].filter = { term: { [key]: filter } }
		}

		return agg
	}

	private createBooleanAggregation(facet: BooleanFacetData) {
		const values = {
			terms: {
				field: facet.config.id
			}
		}

		return this.addFilter(facet.config.id, values)
	}

	private tmp(facetData: HierarchyFacetData, filters: string[], index: number = 0): Record<string, any> {
		const field = index === 0 ? facetData.config.id : getChildFieldName(facetData.config.id, index)
		const terms: ListAggregationTerms = {
			field,
			size: facetData.size,
		}

		const [currentFilter, ...nextFilters] = filters
		// console.log(currentFilter, nextFilters)

		const aggs = filters.length > 0 ?
			this.tmp(facetData, nextFilters, ++index) :
			{}

		return this.addHierarchyFilter(field, currentFilter, { terms, aggs })
	}

	private createHierarchyAggregation(facetData: HierarchyFacetData) {
		const filters = Array.from(facetData.filters)
		const aggs = this.tmp(facetData, filters)

		/*
		 * The top level filter is the starting point for the reduce, because
		 * the top level count aggegration always has to be run. If filters
		 * has values, the reduce will add the underlying levels
		 */
		const topLevelFilter = this.addFilter(`${facetData.config.id}-count`, {
			cardinality: { field: facetData.config.id }
		})

		const countFilters = filters.reduce((prev, _curr, index) => {
			const field = getChildFieldName(facetData.config.id, ++index)
			prev = {
				...prev,
				...this.addFilter(`${field}-count`, {
					cardinality: { field }
				})
			}

			return prev

		}, topLevelFilter)

		const agg = {
			...aggs,
			...countFilters
		}

		return agg
	}

	private createListAggregation(facetData: ListFacetData) {
		const terms: ListAggregationTerms = {
			field: facetData.config.id,
			size: facetData.size,
		}

		// TODO is always filled? or only add when not the default (sort by frequency descending)?
		if (facetData.sort != null) terms.order = { [facetData.sort.by]: facetData.sort.direction }
		if (facetData.query.length) terms.include = `.*${facetData.query}.*`
		
		const agg = {
			...this.addFilter(facetData.config.id, { terms }),
			...this.addFilter(`${facetData.config.id}-count`, {
				cardinality: {
					field: facetData.config.id
				}
			})
		}

		return agg
	}

	private createHistogramAggregation(facet: RangeFacetData): Record<string, any> {
		const values = {
			histogram: {
				field: facet.config.id,
				interval: facet.config.interval,
			}
		}

		return this.addFilter(facet.config.id, values)
	}

	private createDateHistogramAggregation(facet: DateFacetData): Record<string, any> {
		const values = {
			auto_date_histogram: {
				field: facet.config.id,
			}
		}

		return this.addFilter(facet.config.id, values)
	}

	private setQuery(options: ElasticSearchRequestOptions) {
		if (!options.query.length) return
		this.query = { query_string: { query: options.query } }
		this.highlight = { fields: { text: {} }, require_field_match: false }
	}
}

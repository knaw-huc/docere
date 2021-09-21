import { isListFacetData, isBooleanFacetData, isRangeFacetData, isDateFacetData, isHierarchyFacetData, getHierarchyField, getHierarchyChildField } from '@docere/common'

import ESResponseParser from './response-parser'
import createBuckets, { createRangeBuckets } from './get-buckets'

import type { HierarchyKeyCount, HierarchyFacetValues, FacetsData, FSResponse, FacetValues, RangeFacetValue } from '@docere/common'
import { getTo } from '../date.utils'

interface Bucket {
	key: string | number
	doc_count: number
	[key: string]: any
}
function getBuckets(response: any, field: string, useValues = false): Bucket[] {
	const prop = useValues ? 'values' : 'buckets'
	const buckets = response.aggregations[field][field][prop]
	return buckets == null ? [] : buckets
}

function addHierarchyBucket(parentField: string, response: any): (bucket: Bucket) => HierarchyKeyCount {
	return function(bucket: Bucket) {
		const childField = getHierarchyChildField(parentField)
		let child: HierarchyFacetValues = null
		if (bucket.hasOwnProperty(childField)) {
			const buckets: Bucket[] = bucket[childField][childField].buckets

			if (buckets.length) {
				const values = buckets.map(addHierarchyBucket(childField, response))
				child = {
					total: response.aggregations[`${childField}-count`][`${childField}-count`].value,
					values, 
				}
			}
		}
		return {
			key: bucket.key.toString(),
			count: bucket.doc_count,
			child,
		}	
	}
}

export default function ESResponseWithFacetsParser(response: any, facets: FacetsData = new Map()): [FSResponse, Record<string, FacetValues>] {
	const facetValues: Record<string, FacetValues> = {}

	facets.forEach(facet => {
		const field = isHierarchyFacetData(facet) ? getHierarchyField(facet.config.id) : facet.config.id
		let buckets = getBuckets(response, field)

		if (isListFacetData(facet)) {
			facetValues[facet.config.id] = {
				total: response.aggregations[`${facet.config.id}-count`][`${facet.config.id}-count`].value,
				values: buckets.map((b: any) => ({ key: b.key, count: b.doc_count }))
			}
		}
		if (isHierarchyFacetData(facet)) {
			const values: HierarchyFacetValues = {
				total: response.aggregations[`${field}-count`][`${field}-count`].value,
				values: buckets.map(addHierarchyBucket(field, response))
			}

			facetValues[facet.config.id] = values
		}
		else if (isBooleanFacetData(facet)) {
			const trueBucket = buckets.find((b: any) => b.key === 1)
			const trueCount = trueBucket != null ? trueBucket.doc_count : 0
			const falseBucket = buckets.find((b: any) => b.key === 0)
			const falseCount = falseBucket != null ? falseBucket.doc_count : 0

			facetValues[facet.config.id] = [
				{ key: 'true', count: trueCount },
				{ key: 'false', count: falseCount },
			]
		}
		else if (isDateFacetData(facet)) {
			const lastFilter = facet.filters[facet.filters.length - 1]
			if (lastFilter != null) {
				buckets = buckets.filter(b => {
					return b.key >= lastFilter.from && b.key <= lastFilter.to
				})
			}

			let firstBucketKey, lastBucketKey
			if (lastFilter != null) {
				firstBucketKey = lastFilter.from
				lastBucketKey = lastFilter.to
			} else if (buckets.length > 1) {
				firstBucketKey = buckets[0].key
				lastBucketKey = buckets[buckets.length - 1].key
			} else if (buckets.length === 1) {
				firstBucketKey = buckets[0].key
				lastBucketKey = getTo(new Date(buckets[0].key), 1, facet.interval).getTime()
			} else if (facet.value != null) {
				firstBucketKey = facet.value.from
				lastBucketKey = facet.value.to
			}

			const [values, granularity] = createBuckets(new Date(firstBucketKey), new Date(lastBucketKey))
			facet.interval = granularity

			buckets.forEach(b => {
				const ratio = (b.key as number - values[0].from) / (values[values.length - 1].to - values[0].from)
				const index = Math.floor(ratio * values.length)
				values[index].count += b.doc_count
			})

			if (
				(facet.value == null || !facet.filters.length) &&
				values.length > 1
			) {
				const min = values[0]
				const max = values[values.length - 1]

				facet.value = {
					from: min.from,
					to: max.to,
					fromLabel: min.fromLabel,
					toLabel: max.toLabel,
					count: 0
				}
			}
			
			facetValues[facet.config.id] = values
		}
		else if (isRangeFacetData(facet)) {
			// Set the base of the range facet when
			// 1) it's the first time the facet is loaded (facet.value == null)
			// 2) the facet is updated, but not from it's own filter  (!facet.filters.length)
			if ((facet.value == null || !facet.filters.length) && buckets.length) {
				const min = buckets[0].key as number
				const max = buckets[buckets.length - 1].key as number + facet.interval

				facet.value = {
					from: min,
					to: max,
					fromLabel: Math.floor(min).toString(),
					toLabel: Math.ceil(max).toString(),
					count: 0
				}
			}

			let values: RangeFacetValue[]
			if (facet.filters.length) {
				values = createRangeBuckets(facet)

				buckets.forEach(b => {
					const ratio = (b.key as number - values[0].from) / (values[values.length - 1].to - values[0].from)
					let index = Math.floor(ratio * values.length)
					if (index < 0) index = 0
					values[index].count += b.doc_count
				})
			} else {
				values = buckets.map(hv => {
					let to = hv.key as number + facet.interval
					const rangeFacetValue: RangeFacetValue = {
						from: hv.key as number,
						to,
						fromLabel: Math.floor(hv.key as number).toString(),
						toLabel: Math.ceil(to).toString(),
						count: hv.doc_count,
					}
					return rangeFacetValue
				})
			}

			facetValues[facet.config.id] = values		}
	})


	const results = ESResponseParser(response)
	return [results, facetValues]
}

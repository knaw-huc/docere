import { isListFacet, isBooleanFacet, isRangeFacet, isDateFacet, isHierarchyFacet, getChildFieldName } from '../constants'
import ESResponseParser from './response-parser'
import type { HierarchyKeyCount, HierarchyFacetValues, FacetsData, FSResponse, FacetValues, RangeFacetValues } from '@docere/common'

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
		const childField = getChildFieldName(parentField)
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
		const buckets = getBuckets(response, facet.id)

		if (isListFacet(facet)) {
			facetValues[facet.id] = {
				total: response.aggregations[`${facet.id}-count`][`${facet.id}-count`].value,
				values: buckets.map((b: any) => ({ key: b.key, count: b.doc_count }))
			}
		}
		if (isHierarchyFacet(facet)) {
			const values: HierarchyFacetValues = {
				total: response.aggregations[`${facet.id}-count`][`${facet.id}-count`].value,
				values: buckets.map(addHierarchyBucket(facet.id, response))
			}

			facetValues[facet.id] = values
		}
		else if (isBooleanFacet(facet)) {
			const trueBucket = buckets.find((b: any) => b.key === 1)
			const trueCount = trueBucket != null ? trueBucket.doc_count : 0
			const falseBucket = buckets.find((b: any) => b.key === 0)
			const falseCount = falseBucket != null ? falseBucket.doc_count : 0

			facetValues[facet.id] = [
				{ key: 'true', count: trueCount },
				{ key: 'false', count: falseCount },
			]
		}
		else if (isDateFacet(facet)) {
			// TODO set values to from and to, so we have to calculate less in the views
			facetValues[facet.id] = buckets.map(hv => ({
				key: hv.key,
				count: hv.doc_count,
			})) as RangeFacetValues

			facet.interval = response.aggregations[facet.id][facet.id].interval
		}
		else if (isRangeFacet(facet)) {
			facetValues[facet.id] = buckets.map(hv => ({
				key: hv.key,
				count: hv.doc_count,
			})) as RangeFacetValues
		}
	})


	const results = ESResponseParser(response)
	return [results, facetValues]
}

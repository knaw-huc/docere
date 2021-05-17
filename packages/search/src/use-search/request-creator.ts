import type { FacetedSearchProps, ElasticSearchRequestOptions } from '@docere/common'

export default abstract class ESRequest {
	_source: {
		include?: FacetedSearchProps['resultFields'],
		exclude?: FacetedSearchProps['excludeResultFields']
	}

	from: number

	size: number

	sort: any

	track_total_hits: number

	constructor(options: ElasticSearchRequestOptions, context: FacetedSearchProps) {
		this.setSource(context)
		this.size = context.resultsPerPage
		if (options.currentPage > 1) this.from = this.size * (options.currentPage - 1) 
		if (options.sortOrder.size) {
			this.sort = []
			options.sortOrder.forEach((sortDirection, facetId) => {
				this.sort.push({[facetId]: sortDirection})
			})
			this.sort.push('_score')
		}
		if (context.track_total_hits != null) {
			this.track_total_hits = context.track_total_hits
		}
	}

	private setSource(context: FacetedSearchProps) {
		if (!context.resultFields.length && !context.excludeResultFields.length) return

		this._source = {
			include: context.resultFields,
			exclude: context.excludeResultFields
		}
	}
}

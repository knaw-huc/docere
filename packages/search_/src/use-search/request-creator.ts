import type { FacetedSearchContext, ElasticSearchRequestOptions } from '@docere/common'

export default class ESRequest {
	_source: { include?: FacetedSearchContext['resultFields'], exclude?: FacetedSearchContext['excludeResultFields'] }
	from: number
	size: number
	sort: any
	track_total_hits: number

	constructor(options: ElasticSearchRequestOptions, context: FacetedSearchContext) {
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

	private setSource(context: FacetedSearchContext) {
		if (!context.resultFields.length && !context.excludeResultFields.length) return

		this._source = {
			include: context.resultFields,
			exclude: context.excludeResultFields
		}
	}
}

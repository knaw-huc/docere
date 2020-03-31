import ESRequestWithFacets from './request-with-facets-creator'
import ESResponseWithFacetsParser from './response-with-facets-parser'
// import ESRequest from './request-creator'
import ESResponseParser from './response-parser'
import * as React from 'react'
import fetchSearchResults from './fetch'
import type { FSResponse, ElasticSearchRequestOptions, FacetValues } from '@docere/common'

const initialSearchResult: FSResponse = {
	results: [],
	total: 0
}

export default function useSearch(url: string, options: ElasticSearchRequestOptions): [FSResponse, Record<string, FacetValues>] {
	const [searchResult, setSearchResult] = React.useState(initialSearchResult)
	const [facetValues, setFacetValues] = React.useState({})

	React.useEffect(() => {
		const searchRequest = new ESRequestWithFacets(options)

		fetchSearchResults(url, searchRequest)
			.then(result => {
				const searchResponse = ESResponseParser(result)
				setSearchResult(searchResponse)
			})
			.catch(err => {
				console.log(err)
			})
	}, [url, options.currentPage, options.excludeResultFields, options.resultFields, options.resultsPerPage, options.sortOrder])

	React.useEffect(() => {
		if (options.facetsData == null) return
		const searchRequest = new ESRequestWithFacets(options)

		fetchSearchResults(url, searchRequest)
			.then(result => {
				const [searchResponse, facetValues] = ESResponseWithFacetsParser(result, options.facetsData)
				setSearchResult(searchResponse)
				setFacetValues(facetValues)
			})
			.catch(err => {
				console.log(err)
			})
	}, [url, options.facetsData, options.query])

	return [searchResult, facetValues]
}

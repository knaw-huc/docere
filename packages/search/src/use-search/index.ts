import React from 'react'
import { FSResponse, ElasticSearchRequestOptions, FacetValues, SearchPropsContext } from '@docere/common'

import ESRequestWithFacets from './request-with-facets-creator'
import ESResponseWithFacetsParser from './response-with-facets-parser'
import ESResponseParser from './response-parser'
import fetchSearchResults from './fetch'

const initialSearchResult: FSResponse = {
	results: [],
	total: 0
}

export default function useSearch(options: ElasticSearchRequestOptions): [FSResponse, Record<string, FacetValues>] {
	const [searchResult, setSearchResult] = React.useState(initialSearchResult)
	const [facetValues, setFacetValues] = React.useState({})
	const context = React.useContext(SearchPropsContext)

	React.useEffect(() => {
		const searchRequest = new ESRequestWithFacets(options, context)

		fetchSearchResults(context.url, searchRequest)
			.then(result => {
				const searchResponse = ESResponseParser(result)
				setSearchResult(searchResponse)
			})
			.catch(err => {
				console.log(err)
			})
	}, [context.url, options.currentPage, options.sortOrder])

	React.useEffect(() => {
		if (options.facetsData == null) return
		const searchRequest = new ESRequestWithFacets(options, context)

		fetchSearchResults(context.url, searchRequest)
			.then(result => {
				const [searchResponse, facetValues] = ESResponseWithFacetsParser(result, options.facetsData)
				setSearchResult(searchResponse)
				setFacetValues(facetValues)
			})
			.catch(err => {
				console.log(err)
			})
	}, [context.url, options.facetsData, options.query])

	return [searchResult, facetValues]
}

import React from 'react'
import { EsDataType, SearchPropsContext, SortBy, SortDirection, languageMaps, Language, Colors, SearchContext } from '@docere/common'

import useSearchReducer from './facets-context/reducer'
import App from './app'

import type { FacetsConfig, FacetedSearchProps, ResultBodyProps } from '@docere/common'

export * from './utils'
export * from './date.utils'
export {
	EsDataType,
	SearchContext,
	SortBy,
	SortDirection,
	useSearchReducer,
}
export type {
	FacetsConfig,
}

export type {
	FacetedSearchProps as FacetedSearchProps,
	ResultBodyProps
}

// declare global {
// 	const DOCERE_DTAP: string
// }

const initialSearchPropsContextState: FacetedSearchProps = {
	ResultBodyComponent: null,
	excludeResultFields: [],
	language: Language.EN,
	onClickResult: () => {},
	resultFields: [],
	resultsPerPage: 10,
	small: false, /* Render for small screen (~< 1000px) */
	style: {
		spotColor: Colors.BlueBright
	},
	url: null
}

export default function FacetedSearch(props: FacetedSearchProps) {
	const value = { ...initialSearchPropsContextState, ...props}

	return (
		<SearchPropsContext.Provider value={{ ...value, i18n: languageMaps[value.language] }}>
			<App />
		</SearchPropsContext.Provider>
	)
}

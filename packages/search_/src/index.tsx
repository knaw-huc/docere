import React from 'react'
import { EsDataType, SortBy, SortDirection } from '@docere/common'

import SearchContext from './facets-context'
import useSearchReducer from './facets-context/reducer'

import Context, { defaultFacetedSearchProps } from './context'
import App from './app'

import type { FacetedSearchProps, ResultBodyProps } from '@docere/common'

export * from './utils'
export * from './date.utils'
export { EsDataType, SearchContext, useSearchReducer, SortBy, SortDirection }

export type {
	FacetedSearchProps,
	ResultBodyProps
}

export default function FacetedSearch(props: FacetedSearchProps) {
	return (
		<Context.Provider value={{ ...defaultFacetedSearchProps, ...props }}>
			<App />
		</Context.Provider>
	)
}

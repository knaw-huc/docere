import React from 'react'
import { EsDataType } from '@docere/common'

import FacetedSearchContext, { defaultFacetedSearchProps } from './context'
import App from './app'

import type { FacetedSearchProps, ResultBodyProps } from '@docere/common'

export { EsDataType }

export type {
	FacetedSearchProps,
	ResultBodyProps
}

export default function FacetedSearch(props: FacetedSearchProps) {
	return (
		<FacetedSearchContext.Provider value={{ ...defaultFacetedSearchProps, ...props }}>
			<App />
		</FacetedSearchContext.Provider>
	)
}

import React from 'react'
import { SearchContext, useSearchReducer } from '@docere/search'
import useFacetsConfig from '../../search/use-fields'

export function SearchProvider(props: { children: React.ReactNode }) {
	const facetsConfig = useFacetsConfig()
	const [state, dispatch] = useSearchReducer(facetsConfig)

	return (
		<SearchContext.Provider value={{ state, dispatch }}>
			{props.children}
		</SearchContext.Provider>
	)
}

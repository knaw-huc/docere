import React from 'react'
import { SearchContext, useSearchReducer } from '../../../../search/src'
import useFacetsConfig from '../../search/use-fields'

export function SearchProvider(props: { children: React.ReactNode }) {
	const facetsConfig = useFacetsConfig()
	const [state, dispatch] = useSearchReducer(facetsConfig)

	// TODO wrap state and dispatch in a React.useState or make
	// seperate context for SearchDispatch
	return (
		<SearchContext.Provider value={{ state, dispatch }}>
			{props.children}
		</SearchContext.Provider>
	)
}

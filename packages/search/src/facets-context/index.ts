import React from 'react'
import type { FacetsData, FacetsDataReducerAction, FacetsConfig } from '@docere/common'

export const initialSearchContextState: FacetsState = {
	facets: new Map(),
	facetsConfig: {},
	query: ''
}

export interface FacetsState {
	facets: FacetsData
	facetsConfig: FacetsConfig
	query: string
}
interface SearchContext {
	state: FacetsState
	dispatch: React.Dispatch<FacetsDataReducerAction>
}
const SearchContext = React.createContext<SearchContext>(null)
export default SearchContext

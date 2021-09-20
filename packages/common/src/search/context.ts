import React from "react"
import { ActiveFilter, FacetsConfig, FacetsData, FacetsDataReducerAction } from ".."

import type { LanguageMap } from "./language"
import type { FacetedSearchProps } from ".."

/**
 * SearchPropsContext
 * 
 * Context to keep the state of the initial config of the FacetedSearch,
 * passed as props to the FacetedSearch component.
 */ 
type SearchPropsContext = Omit<FacetedSearchProps, 'language'> & { i18n: LanguageMap }
export const SearchPropsContext =  React.createContext<SearchPropsContext>(null)


/**
 * SearchContext
 * 
 * Context to keep the state of the full text input and the facets. This
 * context is also used in other parts of the Docere UI to adjust the
 * search state.
 */
export const initialSearchContextState: FacetsState = {
	facets: new Map(),
	facetsConfig: {},
	filters: [],
	isActive: false,
	query: ''
}

export interface FacetsState {
	facets: FacetsData
	facetsConfig: FacetsConfig
	filters: ActiveFilter[]

	/**
	 * The search becomes active when the user adds a facet filter or
	 * full text query. When the user starts a new search or removes
	 * all filters and the full text query, the search becomes inactive
	 * again
	 */ 
	isActive: boolean

	query: string
}
interface SearchContext {
	state: FacetsState
	dispatch: React.Dispatch<FacetsDataReducerAction>
}
export const SearchContext = React.createContext<SearchContext>(null)

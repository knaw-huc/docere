import { SortDirection, SearchTab, Language } from '../../enum'

import type { FacetsData, FacetConfig, FacetFilter } from './facets'

export * from './facets-data.action'
export * from './facets'

export interface FacetedSearchProps {
	autoSuggest?: (query: string) => Promise<string[]>
	className?: string /* className prop is used by StyledComponents */
	excludeResultFields?: string[]
	language?: Language
	onClickResult: (result: any, ev: React.MouseEvent<HTMLLIElement>) => void
	resultFields?: string[]
	ResultBodyComponent: React.FC<ResultBodyProps>
	resultBodyProps?: Record<string, any>
	resultsPerPage?: number
	small?: boolean
	track_total_hits?: number
	style?: {
		spotColor: string
	}
	url: string
}

// export type FacetedSearchContext = Omit<FacetedSearchProps, 'facetsConfig'> & { facetsConfig: Record<string, FacetConfig> }

// type Filters = Map<string, Set<string>>
export type Filters = Record<string, FacetFilter>
export type FacetsConfig = Record<string, FacetConfig>

export type SortOrder = Map<string, SortDirection>
export type SetSortOrder = (sortOrder: SortOrder) => void

export interface ElasticSearchRequestOptions {
	currentPage: number
	facetsData: FacetsData
	query: string
	sortOrder: SortOrder
}

export interface ElasticSearchFacsimile { id: string, path: string }
/**
 * JSON object which represents a ElasticSearch document
 */
export interface ElasticSearchDocument {
	facsimiles: ElasticSearchFacsimile[]
	id: string
	text: string
	text_suggest: { input: string[] }
	[key: string]: any
}

export interface Hit {
	facsimiles?: ElasticSearchDocument['facsimiles']
	id: string
	snippets: string[]
	[key: string]: any
}

export interface FSResponse {
	results: Hit[]
	total: number
}

// interface ParsedResponse {
// 	aggregations: { [id: string]: any}
// 	hits: any[]
// 	total: number
// }

// interface SearchResults {
// 	hits: Hit[]
// 	id?: string
// 	query?: Object
// 	total: number
// }

export interface ActiveFilter {
	id: string
	title: string
	values: string[]
}

export interface ResultBodyProps {
	result: Hit
}

export interface DocereResultBodyProps extends ResultBodyProps {
	activeId: string
	children?: React.ReactNode
	searchTab: SearchTab
}


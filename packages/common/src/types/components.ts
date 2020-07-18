import type { EntryState, EntryStateAction } from './entry/state'
import type { AppStateAction } from './app'
import type { DocereConfig } from './config-data/config'
import { TextLayer } from './config-data/layer'

export type ReactComponent = React.FunctionComponent<any>
export type DocereComponents = Record<string, ReactComponent>

export type Navigate = (payload: NavigatePayload) => void

export interface UrlQuery {
	entityId?: string		/* ei */
	noteId?: string			/* ni */
	facsimileId?: string	/* fi */
	lineId?: string			/* li */
}
export interface NavigatePayload {
	type: 'entry' | 'page' | 'search'
	id: string
	query?: UrlQuery
}

export interface ComponentProps {
	attributes?: Record<string, string>
	children?: React.ReactNode
}

export type DocereComponentProps =
	ComponentProps &
	Pick<EntryState, 'activeEntity' | 'activeFacsimile' | 'activeFacsimileAreas' | 'activeNote' | 'entry'> &
	{
		appDispatch: React.Dispatch<AppStateAction>
		components: DocereComponents
		config: DocereConfig
		entryDispatch: React.Dispatch<EntryStateAction>
		entrySettings: DocereConfig['entrySettings']
		insideNote: boolean
		layer: TextLayer
	}

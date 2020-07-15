// import { AsideTab } from '../enum'
import type { EntryState, EntryStateAction } from './entry/state'
import type { AppStateAction } from './app'
import type { DocereConfig } from './config-data/config'
import type { TextLayer } from './config-data/functions'

// type SetActiveId = (id: string, listId: string, asideTab: AsideTab) => void

export type ReactComponent = React.FunctionComponent<any>
export type DocereComponents = Record<string, ReactComponent>

// type GetComponents = (config: DocereConfig) => DocereComponents
export type Navigate = (payload: NavigatePayload) => void

export interface NavigatePayload {
	type: 'entry' | 'page' | 'search'
	id: string
	query?: Record<string, string>
}

export interface ComponentProps {
	attributes?: Record<string, string>
	children?: React.ReactNode
	useNavigate: () => (payload: NavigatePayload) => void
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

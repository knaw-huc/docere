import type { EntryState, EntryStateAction } from './entry/state'
import type { AppStateAction } from './app'
import type { DocereConfig } from './config-data/config'
import { TextLayer } from './config-data/layer'

export type ReactComponent = React.FunctionComponent<any>
export type DocereComponents = Record<string, ReactComponent>

export interface ComponentProps {
	attributes?: Record<string, string>
	children?: React.ReactNode
}

export type DocereComponentProps =
	ComponentProps &
	Pick<EntryState, 'activeEntities' | 'activeFacsimiles' | 'entry'> &
	{
		appDispatch: React.Dispatch<AppStateAction>
		components: DocereComponents
		config: DocereConfig
		entryDispatch: React.Dispatch<EntryStateAction>
		entrySettings: DocereConfig['entrySettings']
		insideNote: boolean
		layer: TextLayer
	}

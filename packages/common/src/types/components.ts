import type { EntryStateAction } from './entry/state'
import type { DocereConfig } from './config-data/config'
import type { TextLayer } from './config-data/layer'
import type { Entry, EntryState } from './entry'

export type ReactComponent = React.FunctionComponent<DocereComponentProps>
export type DocereComponents = Record<string, ReactComponent>

export interface ComponentProps {
	attributes?: Record<string, string>
	children?: React.ReactNode
}

export type DocereComponentProps =
	ComponentProps &
	{
		activeEntities: EntryState['activeEntities']
		activeFacsimiles: EntryState['activeFacsimiles']
		components: DocereComponents
		config: DocereConfig
		entry: Entry
		entryDispatch: React.Dispatch<EntryStateAction>
		entrySettings: DocereConfig['entrySettings']
		insideNote: boolean
		layer: TextLayer
	}

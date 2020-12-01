import { FooterTab, SearchTab, Viewport, DocereConfig, GetComponents, GetUIComponent, AsideTab } from '..';
import { initialProjectContext, initialUIContext, initialEntryContextValue, initialEntitiesContextValue, ActiveEntities, initialFacsimileContextValue, initialEntrySettingsContextValue, initialAsideTabContextValue, initialLayersContextValue } from './context';
import { Entry, ActiveFacsimile, Layers, TriggerContainer } from '../entry'

export interface ProjectState {
	activeFacsimile: ActiveFacsimile
	activeEntities: ActiveEntities
	asideTab: AsideTab
	entry: Entry
	entrySettings: DocereConfig['entrySettings']
	config: DocereConfig
	footerTab: FooterTab
	getComponents: GetComponents
	getUIComponent: GetUIComponent
	layers: Layers
	searchTab: SearchTab
	searchUrl: string
	setEntry: {
		entryId: string
		facsimileId?: string
		entityIds?: Set<string>
	} & TriggerContainer
	viewport: Viewport
}

export const initialProjectState: ProjectState = {
	...initialProjectContext,
	...initialUIContext,
	activeFacsimile: initialFacsimileContextValue,
	activeEntities: initialEntitiesContextValue,
	asideTab: initialAsideTabContextValue,
	entry: initialEntryContextValue,
	entrySettings: initialEntrySettingsContextValue,
	layers: initialLayersContextValue,
	setEntry: null,
}

import { FooterTab, SearchTab, Viewport, DocereConfig, GetComponents, AsideTab } from '..';
import { initialProjectContext, initialUIContext, initialEntryContextValue, initialEntitiesContextValue, ActiveEntities, initialFacsimileContextValue, initialEntrySettingsContextValue, initialAsideTabContextValue, initialLayersContextValue } from './context';
import { Entry, ActiveFacsimile, Layers, TriggerContainer } from '../entry'
import { UIComponentsMap } from '../types';

export interface ProjectState {
	activeFacsimile: ActiveFacsimile
	activeEntities: ActiveEntities
	asideTab: AsideTab
	entry: Entry
	entrySettings: DocereConfig['entrySettings']
	config: DocereConfig
	footerTab: FooterTab
	getComponents: GetComponents
	uiComponents: UIComponentsMap
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

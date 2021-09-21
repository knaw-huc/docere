import { FooterTab, SearchTab, Viewport, DocereConfig, GetComponents, AsideTab, UIComponentsMap } from '..';
import { initialProjectContext, initialUIContext, initialEntryContextValue, initialEntitiesContextValue, ActiveEntities, initialFacsimileContextValue, initialEntrySettingsContextValue, initialAsideTabContextValue, initialLayersContextValue } from './context';
import { Entry, ActiveFacsimile, Layers, TriggerContainer } from '../entry'
import { Page } from '../page';
import { LanguageMap } from '../search';

export interface ProjectState {
	activeFacsimile: ActiveFacsimile
	activeEntities: ActiveEntities
	asideTab: AsideTab
	entry: Entry
	entrySettings: DocereConfig['entrySettings']
	config: DocereConfig
	footerTab: FooterTab
	getComponents: GetComponents
	i18n: LanguageMap
	uiComponents: UIComponentsMap
	layers: Layers
	page: Page
	searchTab: SearchTab
	searchUrl: string
	setEntry: {
		entryId: string
		facsimileId?: string
		entityIds?: Set<string>
	} & TriggerContainer
	setPage: {
		entityIds?: Set<string>
		pageId: string
	}
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
	page: null,
	setEntry: null,
	setPage: null,
}

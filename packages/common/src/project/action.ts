import { Viewport, DocereComponentContainer, AsideTab } from '../enum';
import { ProjectState } from './state';
import { ID } from '../entry/layer';
import { DocereConfig } from '../types/config-data/config';

interface ToggleFooterTab {
	type: 'TOGGLE_TAB',
	tabType: 'footer'
	tab: ProjectState['footerTab']
}

interface ToggleSearchTab {
	type: 'TOGGLE_TAB',
	tabType: 'search'
	tab: ProjectState['searchTab']
}

export type ToggleTab = ToggleFooterTab | ToggleSearchTab

export type AddEntity = {
	entityId: ID,
	triggerContainer?: DocereComponentContainer
	triggerContainerId?: ID
	type: 'ADD_ENTITY',
}

export type SetEntry =
	Pick<ProjectState, 'entry'> &
	{
		type: 'SET_ENTRY'
	}

export type SetEntryId =
	Pick<ProjectState, 'setEntry'> &
	{
		type: 'SET_ENTRY_ID'
	}

export type SetFacsimile = {
	facsimileId: ID,
	triggerContainer?: DocereComponentContainer
	triggerContainerId?: ID
	type: 'SET_FACSIMILE',
}

export type SetProject =
	Pick<ProjectState, 'config' | 'getComponents' | 'searchUrl' | 'uiComponents'> &
	{
		type: 'SET_PROJECT'
	}

export interface SetViewport {
	type: 'SET_VIEWPORT'
	viewport: Viewport
}

export interface ToggleEntrySetting {
	type: 'TOGGLE_ENTRY_SETTING',
	property: keyof DocereConfig['entrySettings']
}

export interface SetAsideTab {
	type: 'SET_ASIDE_TAB',
	tab: AsideTab
}

export interface ToggleLayer {
	type: 'TOGGLE_LAYER',
	id: ID
}

export interface PinLayer {
	type: 'PIN_LAYER',
	id: ID
}

export type SetPage =
	Pick<ProjectState, 'page'> &
	{
		type: 'SET_PAGE'
	}

export type SetPageId =
	Pick<ProjectState, 'setPage'> &
	{
		type: 'SET_PAGE_ID'
	}

export interface UnsetPage {
	type: 'UNSET_PAGE'
}

export type ProjectAction = 
	AddEntity |
	PinLayer |
	SetAsideTab |
	SetEntry |
	SetEntryId |
	SetFacsimile |
	SetPage |
	SetPageId |
	SetProject |
	SetViewport |
	ToggleEntrySetting |
	ToggleLayer |
	ToggleTab |
	UnsetPage

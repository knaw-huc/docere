import React from 'react'
import type { DocereConfig, GetComponents, GetUIComponent } from './types'

export interface ProjectContext {
	config: DocereConfig
	getComponents: GetComponents
	getUIComponent: GetUIComponent
	searchUrl: string
}

export const initialProjectContext: ProjectContext = null
// export const initialProjectContext: ProjectContext = {
// 	config: { slug: null },
// 	getComponents: async () => ({}),
// 	getUIComponent: async () => null,
// 	searchUrl: ''
// }

export const ProjectContext = React.createContext<ProjectContext>(initialProjectContext)

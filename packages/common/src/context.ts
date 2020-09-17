import React from 'react'
import type { DocereConfig, GetComponents, GetUIComponent } from './types'

interface ProjectContext {
	config: DocereConfig
	getComponents: GetComponents
	getUIComponent: GetUIComponent
	searchUrl: string
}
const ProjectContext = React.createContext<ProjectContext>(null)

export { ProjectContext }

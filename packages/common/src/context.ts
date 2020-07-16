import React from 'react'
import type { DocereConfig, GetComponents, GetUIComponent, DocereConfigData } from './types'

interface ProjectContext {
	config: DocereConfig
	configData: DocereConfigData
	getComponents: GetComponents
	getUIComponent: GetUIComponent
	searchUrl: string
}
const ProjectContext = React.createContext<ProjectContext>(null)

export { ProjectContext }

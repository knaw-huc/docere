import * as React from 'react'
import { DocereComponentContainer, UIComponentType, DocereConfig } from '@docere/common'
import type { DocereComponents, GetComponents, GetUIComponent } from '@docere/common'

export function useComponents(container: DocereComponentContainer, id?: string) {
	const [components, setComponents] = React.useState<DocereComponents>(null)
	const { getComponents } = React.useContext(ProjectContext)

	React.useEffect(() => {
		getComponents(container, id).then(c => setComponents(c))
	}, [container, id])

	return components
}

export function useUIComponent(componentType: UIComponentType, id?: string) {
	const [component, setComponent] = React.useState<React.FC<any>>(null)
	const { getUIComponent } = React.useContext(ProjectContext)

	React.useEffect(() => {
		getUIComponent(componentType, id).then(c => {
			if (c != null) setComponent(c)
			else import('../project-components/generic-result-body').then(c => setComponent(c.default))
		})
	}, [componentType, id])

	return component
}

interface ProjectContext {
	config: DocereConfig
	getComponents: GetComponents
	getUIComponent: GetUIComponent
}
const ProjectContext = React.createContext<ProjectContext>(null)

export default ProjectContext

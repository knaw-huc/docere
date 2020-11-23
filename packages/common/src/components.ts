import React from 'react'
import type { DocereComponents } from './types'
import { DocereComponentContainer, UIComponentType } from './enum'
import { ProjectContext } from './context'

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
		})
	}, [componentType, id])

	return component
}

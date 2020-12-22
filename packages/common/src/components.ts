import React from 'react'
import type { DocereComponents } from './types'
import { ContainerType, UIComponentType } from './enum'
import { ProjectContext } from './project/context'

export function useComponents(container: ContainerType, id?: string) {
	const [components, setComponents] = React.useState<DocereComponents>(null)
	const { getComponents } = React.useContext(ProjectContext)

	React.useEffect(() => {
		getComponents(container, id).then(c => setComponents(c))
	}, [container, id])

	return components
}

export function useUIComponent(componentType: UIComponentType, id?: string) {
	const { uiComponents } = React.useContext(ProjectContext)
	return uiComponents?.get(componentType)?.get(id)
}

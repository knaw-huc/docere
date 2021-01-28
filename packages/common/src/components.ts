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

export function useUIComponent(componentType: UIComponentType.SearchResult): React.FC<any> 
export function useUIComponent(componentType: UIComponentType.Entity, id: string): React.FC<any> 
export function useUIComponent(componentType: UIComponentType, id?: string) {
	const { uiComponents } = React.useContext(ProjectContext)

	return id == null ?
		// TODO export should be a React.FC<any> not a Map
		uiComponents?.get(componentType) : 
		uiComponents?.get(componentType)?.get(id)
}

import React from 'react'
import type { DocereComponents } from './types'
import { ContainerType, UIComponentType } from './enum'
import { ProjectContext } from './project/context'
// import { ID } from './entry/layer'

export function useComponents(container: ContainerType, id?: string) {
	const [components, setComponents] = React.useState<DocereComponents>(null)
	const { getComponents } = React.useContext(ProjectContext)

	React.useEffect(() => {
		getComponents(container, id).then(c => setComponents(c))
	}, [container, id])

	return components
}

// const uiComponentCache: Map<UIComponentType, Map<ID, any>> = new Map()
export function useUIComponent(componentType: UIComponentType, id?: string) {
	// const [component, setComponent] = React.useState<React.FC<any>>(null)
	// console.log(componentType, id)
	const { uiComponents } = React.useContext(ProjectContext)
	// if (uiComponents == null) return null
	// console.log(uiComponents)
	return uiComponents?.get(componentType)?.get(id)


	// React.useEffect(() => {
	// 	if (!uiComponentCache.has(componentType)) uiComponentCache.set(componentType, new Map())
	// 	const typeCache = uiComponentCache.get(componentType)

	// 	console.log(typeCache)
	// 	if (typeCache.has(id)) setComponent(typeCache.get(id))
	// 	else {
	// 		getUIComponent(componentType, id).then(c => {
	// 			console.log('fetched')
	// 			if (c != null) {
	// 				typeCache.set(id, c)
	// 				setComponent(c)
	// 			}
	// 		})

	// 	}
	// }, [componentType, id])

	// return component
}

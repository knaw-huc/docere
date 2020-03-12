import * as React from 'react'
import { DocereComponentContainer, UIComponentType } from '@docere/common'

export function useComponents(container: DocereComponentContainer, id?: string) {
	const [components, setComponents] = React.useState<DocereComponents>(null)
	const appContext = React.useContext(AppContext)

	React.useEffect(() => {
		appContext.getComponents(container, id).then(c => setComponents(c))
	}, [container, id])

	return components
}

export function useUIComponent(componentType: UIComponentType, id?: string) {
	const [component, setComponent] = React.useState<React.FC<any>>(null)
	const appContext = React.useContext(AppContext)

	React.useEffect(() => {
		appContext.getUIComponent(componentType, id).then(c => {
			if (c != null) setComponent(c)
			else import('../project-components/generic-result-body').then(c => setComponent(c.default))
		})
	}, [componentType, id])

	return component
}

interface AppContext {
	config: DocereConfig
	getComponents: GetComponents
	getUIComponent: GetUIComponent
}
const AppContext = React.createContext<AppContext>(null)

export default AppContext

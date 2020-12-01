import React from 'react'
import { UIContext, ProjectState, initialUIContext } from '@docere/common'
import type { UIContextValue } from '@docere/common'

export function UIProvider(props: { children: React.ReactNode, state: ProjectState }) {
	const [value, setValue] = React.useState<UIContextValue>(initialUIContext)

	React.useEffect(() => {
		setValue({
			footerTab: props.state.footerTab,
			searchTab: props.state.searchTab,
			viewport: props.state.viewport
		})
	}, [props.state.footerTab, props.state.searchTab, props.state.viewport])

	return (
		<UIContext.Provider value={value}>
			{props.children}
		</UIContext.Provider>
	) 
}

import React from 'react'
import { ProjectContext, ProjectState, initialProjectContext } from '@docere/common'
import type { ProjectContextValue } from '@docere/common'

export function ProjectProvider(props: { children: React.ReactNode, state: ProjectState }) {
	const [value, setValue] = React.useState<ProjectContextValue>(initialProjectContext)

	React.useEffect(() => {
		setValue({
			config: props.state.config,
			getComponents: props.state.getComponents,
			i18n: props.state.i18n,
			searchUrl: props.state.searchUrl,
			uiComponents: props.state.uiComponents,
		})
	}, [
		props.state.config,
		props.state.uiComponents,
		props.state.getComponents,
		props.state.searchUrl
	])

	if (value.config == null) return null

	return (
		<ProjectContext.Provider value={value}>
			{props.children}
		</ProjectContext.Provider>
	)
}

import React from 'react'
import { useParams } from 'react-router-dom'
import { initialProjectContext, ProjectContext } from '@docere/common'
import configs from '@docere/projects'

function useProjectData() {
	const [projectContext, setProjectContext] = React.useState<ProjectContext>(initialProjectContext)
	const { projectId } = useParams()

	React.useEffect(() => {
		if (projectId == null) return
		
		if (configs[projectId].getUIComponent == null) configs[projectId].getUIComponent = async () => ({ default: () => async () => null })
		// TODO redirect to 404 if projectSlug does not exist
		Promise.all([
			configs[projectId].config(),
			configs[projectId].getTextComponents(),
			configs[projectId].getUIComponent(),
		]).then(result => {
			const config = result[0].default
			const context: ProjectContext = {
				config,
				getComponents: result[1].default(config),
				getUIComponent: result[2].default(config),
				searchUrl: `/search/${config.slug}/_search`,
			}

			setProjectContext(context)
		})
	}, [projectId])

	return projectContext
}

export function ProjectProvider(props: { children: React.ReactNode }) {
	const projectContext = useProjectData()
	if (projectContext == null) return null

	return (
		<ProjectContext.Provider value={projectContext}>
			{props.children}
		</ProjectContext.Provider>
	)
}

import * as React from 'react'
import { SearchContext, useSearchReducer } from '@docere/search'
import { ProjectContext, useUrlObject, DocereConfig } from '@docere/common'
import configs from '@docere/projects'

import Search from '../search'
import { ProjectHeader } from '../header'
import Entry from '../entry'
import PageView from '../page'
import { ProjectUIProvider } from './ui-context'

import useFacetsConfig from '../search/use-fields'
import { Route, useRouteMatch } from 'react-router-dom'

function useProjectData() {
	const [projectContext, setProjectContext] = React.useState<ProjectContext>(null)
	const { projectId } = useUrlObject()

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

export default function Project() {
	const projectContext = useProjectData()
	if (projectContext == null) return null

	return (
		<ProjectContext.Provider value={projectContext}>
			<RealProject
				config={projectContext.config}
			/>
		</ProjectContext.Provider>
	)
}

interface Props {
	config: DocereConfig
}
function RealProject(props: Props) {
	const { path } = useRouteMatch()

	const facetsConfig = useFacetsConfig(props.config)
	const [state, dispatch] = useSearchReducer(facetsConfig)

	return (
		<ProjectUIProvider>
			<SearchContext.Provider value={{ state, dispatch }}>
				<ProjectHeader />
				<Route path={`${path}/pages/:pageId`}>
					<PageView />
				</Route>
				<Search />
				<Entry />
			</SearchContext.Provider>
		</ProjectUIProvider>
	)
}

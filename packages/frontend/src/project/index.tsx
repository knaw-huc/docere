import * as React from 'react'
import { SearchContext, useSearchReducer } from '@docere/search'
import { ProjectContext } from '@docere/common'
import configDatas from '@docere/projects'

import EntrySelector from '../entry-selector'
import { ProjectHeader } from '../header'
import Entry from '../entry'
import PageView from '../page'
import useAppState from './state'

import useFacetsConfig from '../entry-selector/use-fields'
import { useParams, Route, useRouteMatch } from 'react-router-dom'

import type { DocereConfigData } from '@docere/common'

// interface AppProps {
// 	configData: DocereConfigData
// 	EntrySelector: typeof EntrySelector
// }

function useProjectData() {
	const [projectData, setProjectData] = React.useState<[DocereConfigData, ProjectContext]>([null, null])
	const { projectId } = useParams()

	React.useEffect(() => {
		// TODO redirect to 404 if projectSlug does not exist
		configDatas[projectId]().then(({ default: configData }) => {
			const projectContextValue: ProjectContext = {
				config: configData.config,
				getComponents: configData.getComponents(configData.config),
				getUIComponent: configData.getUIComponent(configData.config),
				searchUrl: `/search/${configData.config.slug}/_search`,
			}

			setProjectData([configData, projectContextValue])
		})

	}, [projectId])

	return projectData
}

export default function Project() {
	const [projectConfigData, projectContextValue] = useProjectData()
	if (projectConfigData == null) return null

	return <RealProject
		projectConfigData={projectConfigData}
		projectContextValue={projectContextValue}
	/>
}

interface Props {
	projectConfigData: DocereConfigData
	projectContextValue: ProjectContext
}
function RealProject(props: Props) {
	const match = useRouteMatch()
	const [appState, appDispatch] = useAppState(props.projectConfigData)

	const facetsConfig = useFacetsConfig(props.projectConfigData.config)
	const [state, dispatch] = useSearchReducer(facetsConfig)

	return (
		<ProjectContext.Provider value={props.projectContextValue}>
			<SearchContext.Provider value={{ state, dispatch }}>
				<ProjectHeader
					appDispatch={appDispatch}
				/>
				<Route path={`${match.path}/pages/:pageId`}>
					<PageView />
				</Route>
				<EntrySelector
					appDispatch={appDispatch}
					entry={appState.entry}
					footerTab={appState.footerTab}
					searchTab={appState.searchTab}
					viewport={appState.viewport}
				/>
				<Entry 
					appDispatch={appDispatch}
					entry={appState.entry}
					footerTab={appState.footerTab}
					searchTab={appState.searchTab}
				/>
			</SearchContext.Provider>
		</ProjectContext.Provider>
	)
}

import * as React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'

import Search from '../search'
import { ProjectHeader } from '../header'
import Entry from '../entry'
import PageView from '../page'
import { ProjectUIProvider } from './ui-context'
import { ProjectProvider } from './context'
import { SearchProvider } from './search-context'

export default function Project() {
	const { path } = useRouteMatch()

	return (
		<ProjectProvider>
			<ProjectUIProvider>
				<SearchProvider>
					<ProjectHeader />
					<Route path={`${path}/pages/:pageId`}>
						<PageView />
					</Route>
					<Search />
					<Entry />
				</SearchProvider>
			</ProjectUIProvider>
		</ProjectProvider>
	)
}

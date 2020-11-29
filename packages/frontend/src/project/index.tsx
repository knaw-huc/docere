import * as React from 'react'

import Search from '../search'
import { ProjectHeader } from '../header'
import Entry from '../entry'
import PageView from '../page'
import { ProjectUIProvider } from './ui-context'
import { ProjectProvider } from './context'
import { SearchProvider } from './search-context'

export default function Project() {
	return (
		<ProjectProvider>
			<ProjectUIProvider>
				<SearchProvider>
					<ProjectHeader />
					<PageView />
					<Search />
					<Entry />
				</SearchProvider>
			</ProjectUIProvider>
		</ProjectProvider>
	)
}

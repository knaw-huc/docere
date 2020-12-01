import * as React from 'react'

import Search from '../search'
import { ProjectHeader } from '../header'
import Entry from '../entry'
import PageView from '../page'
import { Providers } from './context'
import { SearchProvider } from './search-context'

export default function Project() {
	return (
		<Providers>
			<SearchProvider>
				<ProjectHeader />
				<PageView />
				<Search />
				<Entry />
			</SearchProvider>
		</Providers>
	)
}

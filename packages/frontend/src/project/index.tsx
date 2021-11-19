import * as React from 'react'

import Search from '../search'
import { ProjectHeader as MainHeader } from '../header'
import Entry from '../entry'
import PageView from '../page'
import { Providers } from './context'
import { SearchProvider } from './search-context'
import { UIComponentType, useUIComponent } from '@docere/common'

export default function Project() {
	return (
		<Providers>
			<SearchProvider>
				<Header />
				<PageView />
				<Search />
				<Entry />
			</SearchProvider>
		</Providers>
	)
}

function Header() {
	const CustomMainHeader = useUIComponent(UIComponentType.MainHeader)
	return CustomMainHeader != null ? <CustomMainHeader /> : <MainHeader />
}

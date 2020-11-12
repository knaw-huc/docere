import React from 'react'
import { AsideTab, EntryTabContext } from '@docere/common'

export function EntryTabProvider(props: { children: React.ReactNode }) {
	const [asideTab, setAsideTab] = React.useState<AsideTab>(null)

	return (
		<EntryTabContext.Provider value={{ asideTab, setAsideTab }}>
			{props.children}
		</EntryTabContext.Provider>
	) 
}

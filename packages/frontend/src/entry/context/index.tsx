import React from 'react'

import { EntitiesProvider } from './entities-context'
import { EntryProvider } from './entry-context'
import { EntrySettingsProvider } from './settings-context'
import { EntryTabProvider } from './tab-context'
import { FacsimileProvider } from './facsimile-context'
import { LayersProvider } from './layers-context'

export function Providers(props: { children: React.ReactNode }) {
	return (
		<EntryProvider>
			<EntrySettingsProvider>
				<FacsimileProvider>
					<EntitiesProvider>
						<EntryTabProvider>
							<LayersProvider>
								{props.children}
							</LayersProvider>
						</EntryTabProvider>
					</EntitiesProvider>
				</FacsimileProvider>
			</EntrySettingsProvider>
		</EntryProvider>
	)
}

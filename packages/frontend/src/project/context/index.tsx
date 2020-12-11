import React from 'react'
import { DispatchContext, EntitiesContext, FacsimileContext, EntrySettingsContext, AsideTabContext, EntryContext, LayersContext, PageContext } from '@docere/common'

import { UIProvider } from './providers/ui'
import { ProjectProvider } from './providers/project'
import { useProjectState } from './state'

export function Providers(props: { children: React.ReactNode }) {
	const [state, dispatch] = useProjectState()

	return (
		<DispatchContext.Provider value={dispatch}>
			<ProjectProvider state={state}>
				<UIProvider state={state}>
					<PageContext.Provider value={state.page}>
						<EntryContext.Provider value={state.entry}>
							<EntrySettingsContext.Provider value={state.entrySettings}>
								<LayersContext.Provider value={state.layers}>
									<FacsimileContext.Provider value={state.activeFacsimile}>
										<EntitiesContext.Provider value={state.activeEntities}>
											<AsideTabContext.Provider value={state.asideTab}>
												{props.children}
											</AsideTabContext.Provider>
										</EntitiesContext.Provider>
									</FacsimileContext.Provider>
								</LayersContext.Provider>
							</EntrySettingsContext.Provider>
						</EntryContext.Provider>
					</PageContext.Provider>
				</UIProvider>
			</ProjectProvider>
		</DispatchContext.Provider>
	)
}

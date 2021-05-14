import React from 'react'
import styled from 'styled-components'
import { PANEL_HEADER_HEIGHT, FacsimileLayer, EntrySettingsContext, ProjectContext, DispatchContext, ContainerType, EntryContext } from '@docere/common'

import PanelHeader from '../header'
import CollectionNavigator from '../collection-navigator'
import { FacsimileNavigatorController } from '../collection-navigator/facsimile-controller'
import { ContainerProvider } from '../text/layer-provider'

import useAreaRenderer from './use-area-renderer'
import { EntityList } from './entity-list'

import { useActiveFacsimile } from './use-active-facsimile'
import { useOpenSeadragon } from './use-open-seadragon'

const Wrapper = styled.div`
	background: #BBB;
	position: sticky;
	top: 0;
	height: 100%;
	z-index: 1;

	.collection-navigator {
		bottom: 0;
		position: absolute;
		width: 100%;
	}
`

const Container = styled.div`
	height: ${(props: { hasHeader: boolean }) => {
		let subtract = 0 		
		if (props.hasHeader) subtract += PANEL_HEADER_HEIGHT
		return `calc(100% - ${subtract}px)`
	}}
`

type Props = {
	layer: FacsimileLayer
}

export const FacsimilePanel = React.memo(function FacsimilePanel(props: Props) {
	const dispatch = React.useContext(DispatchContext)
	const { config } = React.useContext(ProjectContext)
	const settings = React.useContext(EntrySettingsContext)
	const entry = React.useContext(EntryContext)
	const [osd, OpenSeadragon] = useOpenSeadragon()

	const areaRenderer = useAreaRenderer(osd, OpenSeadragon, dispatch)

	useActiveFacsimile(areaRenderer, osd)

	return (
		<ContainerProvider type={ContainerType.Layer} id={props.layer.id}>
			<Wrapper className="facsimile-panel">
				{
					settings['panels.showHeaders'] &&
					<PanelHeader
						layer={props.layer}
					>
						{props.layer.title}
					</PanelHeader>
				}
				<Container
					hasHeader={settings['panels.showHeaders']}
					id="openseadragon"
				/>
				{
					entry.textData.facsimiles.size > 1 &&
					config.collection == null &&
					<CollectionNavigator
						Controller={FacsimileNavigatorController}
					/>
				}
				<EntityList />
			</Wrapper>
		</ContainerProvider>
	)
})

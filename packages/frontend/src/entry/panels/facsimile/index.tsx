import React from 'react'
import styled from 'styled-components'
import { PANEL_HEADER_HEIGHT, FacsimileLayer, EntrySettingsContext, ProjectContext, DispatchContext, ContainerType } from '@docere/common'

import PanelHeader from '../header'
import CollectionNavigator2 from '../collection-navigator2'
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

function FacsimilePanel(props: Props) {
	const dispatch = React.useContext(DispatchContext)
	const { config } = React.useContext(ProjectContext)
	const settings = React.useContext(EntrySettingsContext)
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
					props.layer.facsimiles.size > 1 &&
					config.collection == null &&
					<CollectionNavigator2
						layer={props.layer}
					/>
				}
				<EntityList />
			</Wrapper>
		</ContainerProvider>
	)
}

export default React.memo(FacsimilePanel)

import * as React from 'react'
import styled from 'styled-components'
import { DEFAULT_SPACING, Colors, FooterTab, FOOTER_HANDLE_HEIGHT, ProjectContext, StatefulLayer } from '@docere/common'

import LayersFooterTab from '../footer/layers'
import Panel from './panel'
import CollectionNavigator from './collection-navigator'

import type { DocereConfig, EntryState, EntryStateAction } from '@docere/common'
import type { EntryProps } from '..'

interface WProps {
	hasCollection: boolean
	pinnedLayers: StatefulLayer[]
}
const Wrapper = styled.div`
	background: ${Colors.GreyLight};
	box-sizing: border-box;
	display: grid;
	${(p: WProps) => {
		let columns = p.pinnedLayers
			.map(layer => layer.columnWidth)
			.join(' ')

		return `
			grid-template-columns: ${columns} auto;
		`
	}}
	grid-template-rows: ${props => props.hasCollection ? 'auto 70px' : 'auto'};
	grid-column-gap: 8px;
	grid-row-gap: 8px;
	height: calc(100% - ${FOOTER_HANDLE_HEIGHT}px);
	padding: 0 8px;
	width: 100%;
`

const PanelsCommon = styled.div`
	background: ${Colors.GreyLight};
	display: grid;
	grid-template-rows: 100% auto;
	grid-column-gap: 8px;
	height: 100%;
	overflow-x: auto; 
`

interface PWProps {
	activeLayers: StatefulLayer[]
	settings: DocereConfig['entrySettings']
}
const ActivePanels = styled(PanelsCommon)`
	${(p: PWProps) => {
		let columns = p.activeLayers
			.map(layer => layer.columnWidth)
			.join(' ')

		return `
			grid-template-columns: ${columns};
		`
	}}

	& > header {
		height: ${DEFAULT_SPACING}px;
		display: grid;
		align-content: center;
		padding: 0 ${DEFAULT_SPACING}px;
		font-size: .8rem;
		background: gray;
		color: white;
		text-transform: uppercase;
		border-right: 2px solid #4a4a4a;
	}
`

const PinnedPanels = styled(PanelsCommon)`
`

const SelectLayer = styled.div`
	align-self: center;
	background: ${Colors.Grey};

	& > span {
		color: #888;
		font-size: 2em;
		font-weight: bold;
		left: calc(50% - 250px);
		margin-top: -2em;
		position: absolute;
		text-align: center;
		width: 500px;
	}

	& > div {
		height: 128px;
		position: static;
	}
`

export type PanelsProps = EntryProps & EntryState & {
	entryDispatch: React.Dispatch<EntryStateAction>
}

function Panels(props: PanelsProps) {
	const context = React.useContext(ProjectContext)

	// TODO move to useEffect and useState or does it not matter because of React.memo?
	const layers = Array.from(props.layers.values())
	const activeLayers = layers.filter(l => l.active && !l.pinned)
	const pinnedLayers = layers.filter(l => l.pinned)

	return (
		<Wrapper
			hasCollection={context.config.collection != null}
			id="panels"
			pinnedLayers={pinnedLayers}
		>
			{
				pinnedLayers.length > 0 &&
				<PinnedPanels
					id="pinned-panels"
				>
					{
						pinnedLayers
							.map(layer =>
								<Panel
									{...props}
									key={layer.id}
									layer={layer}
								/>
							)
					}
				</PinnedPanels>
			}
			{
				activeLayers.length > 0 &&
				<ActivePanels
					activeLayers={activeLayers}
					id="active-panels"
					settings={props.entrySettings}
				>
					{
						activeLayers
							.map(layer =>
								<Panel
									{...props}
									key={layer.id}
									layer={layer}
								/>
							)
					}
				</ActivePanels>
			}
			{
				(context.config.collection != null) &&
				<CollectionNavigator
					// appDispatch={props.appDispatch}
					config={context.config.collection}
					entry={props.entry}
					searchUrl={context.searchUrl}
				/>
			}
			{
				!activeLayers.length &&
				!pinnedLayers.length &&
				<SelectLayer>
					<span>Select a panel</span>
					{
						props.footerTab !== FooterTab.Layers &&
						<LayersFooterTab
							active={true}
							dispatch={props.entryDispatch}
							entry={props.entry}
							layers={props.layers}
						/>
					}
				</SelectLayer>
			}
		</Wrapper>
	)
}

export default React.memo(Panels)

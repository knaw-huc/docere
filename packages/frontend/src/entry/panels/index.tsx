import * as React from 'react'
import styled from 'styled-components'
import { DEFAULT_SPACING, Colors, FooterTab } from '@docere/common'

import LayersFooterTab from '../footer/layers'
import Panel from './panel'

import type { DocereConfig, Entity, Layer, Note, EntryState, EntryStateAction } from '@docere/common'
import type { EntryProps } from '..'

interface WProps {
	activeEntity: Entity
	activeNote: Note
	pinnedLayers: Layer[]
	settings: DocereConfig['entrySettings']
}
const Wrapper = styled.div`
	background: ${Colors.GreyLight};
	display: grid;
	${(p: WProps) => {
		let columns = p.pinnedLayers
			.map(layer => layer.columnWidth)
			.join(' ')

		return `
			grid-template-columns: ${columns} auto;
		`
	}}
	grid-column-gap: ${DEFAULT_SPACING / 2}px;
	height: 100%;
	width: 100%;
`

const PanelsCommon = styled.div`
	background: white;
	display: grid;
	grid-template-rows: 100% auto;
	height: 100%;
	overflow-x: auto; 
`

interface PWProps {
	activeEntity: Entity
	activeLayers: Layer[]
	activeNote: Note
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
	const activeLayers = props.layers.filter(layer => layer.active && !layer.pinned)
	const pinnedLayers = props.layers.filter(layer => layer.pinned)

	return (
		<Wrapper
			activeEntity={props.activeEntity}
			activeNote={props.activeNote}
			id="panels"
			pinnedLayers={pinnedLayers}
			settings={props.settings}
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
					activeEntity={props.activeEntity}
					activeNote={props.activeNote}
					id="active-panels"
					settings={props.settings}
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
				!activeLayers.length &&
				!pinnedLayers.length &&
				<SelectLayer>
					<span>Select a panel</span>
					{
						props.footerTab !== FooterTab.Layers &&
						<LayersFooterTab
							active={true}
							activeFacsimile={props.activeFacsimile}
							dispatch={props.entryDispatch}
							layers={props.layers}
						/>
					}
				</SelectLayer>
			}
		</Wrapper>
	)
}

export default React.memo(Panels)

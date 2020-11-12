import React from 'react'
import styled from 'styled-components'
import { DEFAULT_SPACING, PANEL_HEADER_HEIGHT, Colors, StatefulLayer, LayersContext } from '@docere/common'

import type { Layer } from '@docere/common'

const Header = styled.header`
	background: ${Colors.Grey};
	font-size: .8rem;
	height: ${PANEL_HEADER_HEIGHT}px;
	line-height: ${PANEL_HEADER_HEIGHT}px;
	padding-left: ${DEFAULT_SPACING}px;
	position: relative;
`

	// fill: #888;
const Svg = styled.svg`
	cursor: pointer;
	fill: ${(props: { layer: Layer }) => props.layer.pinned ? Colors.Orange : '#888'};
	height: ${PANEL_HEADER_HEIGHT}px;
	position: absolute;
	right: ${DEFAULT_SPACING}px;
	${(props: { layer: Layer }) => props.layer.pinned ? 'transform: rotateZ(45deg);' : ''}
	top: 0;
	width: 12px;

	&:hover {
		fill: #EEE;
	}
`

const Title = styled.div`
	color: #EEE;

	small {
		color: #888;
		margin-right: .33rem;
	}
`

const Close = styled.div`
	color: #888;
	cursor: pointer;
	font-size: 1.2em;
	position: absolute;
	right: 0;
	text-align: center;
	top: 0;
	width: ${DEFAULT_SPACING}px;

	&:hover {
		color: #EEE;
	}
`

interface Props {
	children: React.ReactNode
	layer: StatefulLayer
}
export default function PanelHeader(props: Props) {
	const { pinLayer, activateLayer } = React.useContext(LayersContext)

	const handleActivatePanel = React.useCallback(() => {
		activateLayer(props.layer.id)
	}, [props.layer])

	const handlePinPanel = React.useCallback(() => {
		pinLayer(props.layer.id)
	}, [props.layer])

	return (
		<Header>
			<Title>
				<small>panel</small>
				{props.children}
			</Title>
			{
				props.layer.pinnable &&
				<Svg
					layer={props.layer}
					onClick={handlePinPanel}
					viewBox="0 0 512.519 512.519"
				>
					<path d="M393.846,363.999l111.417-111.417c10.838-10.838,7.051-29.228-7.187-34.902c-59.185-23.587-111.417-27.296-153.314-19.203
						c-1.331,0.257-2.597,0.517-3.8,0.776L206.393,84.761c1.282-20.75-2.945-40.081-10.892-57.423
						c-4.226-9.222-8.596-16.021-11.924-20.156c-7.956-9.885-22.73-10.682-31.703-1.71L5.25,152.074
						c-9.016,9.015-8.164,23.874,1.825,31.799c8.152,6.468,17.255,11.444,27.083,15.084c16.668,6.173,33.657,8.128,49.318,7.515
						l115.5,135.765c-0.2,1.164-0.4,2.393-0.599,3.685c-6.704,43.604-2.748,95.92,19.545,151.922
						c5.67,14.244,24.067,18.035,34.907,7.193l110.849-110.869l110.866,110.866c8.331,8.331,21.839,8.331,30.17,0
						c8.331-8.331,8.331-21.839,0-30.17L393.846,363.999z M247.027,450.496c-9.773-36.221-10.853-69.639-6.479-98.089
						c0.817-5.316,1.586-8.82,1.998-10.295c1.906-6.829,0.295-14.159-4.299-19.559L108.881,170.489
						c-4.829-5.676-12.27-8.421-19.628-7.241c-0.221,0.035-1.035,0.139-2.356,0.259c-9.487,0.861-20.206,0.358-30.484-2.254
						L161.001,56.681c2.975,10.422,3.847,21.658,1.89,33.511c-1.22,7.387,1.522,14.872,7.224,19.723l151.701,129.067
						c5.825,4.956,13.858,6.414,21.053,3.823c1.289-0.464,4.671-1.41,9.985-2.436c26.987-5.213,60.069-4.366,98.016,6.266
						L341.589,355.917L247.027,450.496z"/>
				</Svg>
			}
			<Close onClick={handleActivatePanel}>✕</Close>
		</Header>
	)
}

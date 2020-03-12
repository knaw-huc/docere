import * as React from 'react'
import styled from '@emotion/styled'
import { FOOTER_HEIGHT, FOOTER_HANDLE_HEIGHT, DEFAULT_SPACING, FooterTab, TabPosition } from '@docere/common'
import Tabs from '../../ui/tabs'
import Layers from './layers'

const Wrapper = styled.footer`
	bottom: -${FOOTER_HEIGHT}px;
	display: grid;
	grid-template-rows: ${FOOTER_HANDLE_HEIGHT}px auto;
	height: ${FOOTER_HEIGHT + FOOTER_HANDLE_HEIGHT}px;
	left: 0;
	pointer-events: none;
	position: absolute;
	right: 0;
	z-index: 6001;

	& > * {
		pointer-events: all;
	}
`

const Body = styled.div`
	background-color: black;
	color: white;
	display: grid;
	justify-content: center;
	padding: ${DEFAULT_SPACING/2}px;
`


interface Props {
	footerTab: EntryState['footerTab']
	layers: EntryState['layers']
	entryDispatch: React.Dispatch<EntryStateAction>
}
function Footer(props: Props) {
	const handleTabClick = React.useCallback(footerTab => {
		props.entryDispatch({ type: 'TOGGLE_FOOTER_TAB', footerTab })			
	}, [])

	return (
		<Wrapper>
			<Tabs
				data-tab={props.footerTab}
				onClick={handleTabClick}
				position={TabPosition.Bottom}
				tab={props.footerTab}
				tabs={[FooterTab.PanelSelector]}
			/>
			<Body>
				<Layers
					dispatch={props.entryDispatch}
					layers={props.layers}
				/>
			</Body>
		</Wrapper>
	)
}

export default React.memo(Footer)

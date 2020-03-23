import * as React from 'react'
import styled from 'styled-components'
import { FOOTER_HEIGHT, FOOTER_HANDLE_HEIGHT, FooterTab, TabPosition } from '@docere/common'
import Tabs from '../../ui/tabs'
import Layers from './layers'
import Settings from './settings'
import Downloads from './downloads'

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
	position: relative;
`

interface Props {
	activeFacsimile: Facsimile
	footerTab: EntryState['footerTab']
	layers: EntryState['layers']
	entryDispatch: React.Dispatch<EntryStateAction>
	entry: Entry
	entrySettings: EntrySettings
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
				tabs={[FooterTab.Layers, FooterTab.Settings, FooterTab.Downloads]}
			/>
			<Body>
				<Layers
					active={props.footerTab === FooterTab.Layers}
					activeFacsimile={props.activeFacsimile}
					dispatch={props.entryDispatch}
					layers={props.layers}
				/>
				<Settings
					active={props.footerTab === FooterTab.Settings}
					dispatch={props.entryDispatch}
					entrySettings={props.entrySettings}
				/>
				<Downloads
					active={props.footerTab === FooterTab.Downloads}
					entry={props.entry}
				/>

			</Body>
		</Wrapper>
	)
}

export default React.memo(Footer)

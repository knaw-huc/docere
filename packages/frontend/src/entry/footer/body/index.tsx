import React from 'react'
import styled from 'styled-components'
import { FooterTab, UIContext } from '@docere/common'

import Layers from './layers'
import Settings from './settings'
// import Downloads from './downloads'
// TODO restore downloads

const Wrapper = styled.div`
	background-color: black;
	color: white;
	position: relative;
`

export function Body() {
	const uiState = React.useContext(UIContext)

	return (
		<Wrapper>
			<Layers
				active={uiState.footerTab === FooterTab.Panels}
			/>
			<Settings
				active={uiState.footerTab === FooterTab.Settings}
			/>
			{/* <Downloads
				active={uiState.footerTab === FooterTab.Downloads}
			/> */}
		</Wrapper>
	)
}

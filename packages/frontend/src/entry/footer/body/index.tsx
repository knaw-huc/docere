import React from 'react'
import styled from 'styled-components'
import { FooterTab } from '@docere/common'

import { ProjectUIContext } from '../../../project/ui-context'
import Layers from './layers'
import Settings from './settings'
import Downloads from './downloads'

const Wrapper = styled.div`
	background-color: black;
	color: white;
	position: relative;
`

export function Body() {
	const { state } = React.useContext(ProjectUIContext)

	return (
		<Wrapper>
			<Layers
				active={state.footerTab === FooterTab.Layers}
			/>
			<Settings
				active={state.footerTab === FooterTab.Settings}
			/>
			<Downloads
				active={state.footerTab === FooterTab.API}
			/>
		</Wrapper>
	)
}

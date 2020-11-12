import React from 'react'
import styled from 'styled-components'
import { FOOTER_HANDLE_HEIGHT } from '@docere/common'

import { SearchTabs } from './search'
import { FooterTabs } from './footer'
import { AsideTabs } from './aside'

const Wrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	height: ${FOOTER_HANDLE_HEIGHT}px;
	line-height: ${FOOTER_HANDLE_HEIGHT}px;
	padding: 0 8px;

	& > .footer-tabs {
		justify-self: center;
	}

	& > .aside-tabs {
		justify-self: end;
	}
`
export function Tabs() {
	return (
		<Wrapper>
			<SearchTabs />
			<FooterTabs />
			<AsideTabs />
		</Wrapper>
	)
}

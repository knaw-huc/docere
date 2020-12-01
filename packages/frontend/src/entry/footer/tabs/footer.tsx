import React from 'react'
import { FooterTab, UIContext, DispatchContext } from '@docere/common'

import { Button } from '..'

export function FooterTabs() {
	const dispatch = React.useContext(DispatchContext)
	const uiState = React.useContext(UIContext)

	const onClick = React.useCallback(ev => {
		const { tab } = ev.target.dataset
		dispatch({ type: 'TOGGLE_TAB', tabType: 'footer', tab })
	}, [])

	return (
		<div
			className="footer-tabs"
			onClick={onClick}
		>
			<Button
				active={uiState.footerTab === FooterTab.Layers}
				data-tab={FooterTab.Layers}
			>
				Layers
			</Button>
			<Button
				active={uiState.footerTab === FooterTab.Settings}
				data-tab={FooterTab.Settings}
			>
				Settings
			</Button>
			<Button
				active={uiState.footerTab === FooterTab.API}
				data-tab={FooterTab.API}
			>
				API
			</Button>
		</div>
	)
}

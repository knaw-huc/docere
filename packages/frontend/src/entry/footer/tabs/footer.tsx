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
			{
				Object.values(FooterTab).map(name =>
					<Button
						active={uiState.footerTab === name}
						data-tab={name}
						key={name}
					>
						{name}
					</Button>
				)
			}
		</div>
	)
}

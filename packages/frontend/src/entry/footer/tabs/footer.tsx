import React from 'react'
import { FooterTab } from '@docere/common'

import { ProjectUIContext } from '../../../project/ui-context'
import { Button } from '..'

export function FooterTabs() {
	const { state, dispatch } = React.useContext(ProjectUIContext)

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
				active={state.footerTab === FooterTab.Layers}
				data-tab={FooterTab.Layers}
			>
				Layers
			</Button>
			<Button
				active={state.footerTab === FooterTab.Settings}
				data-tab={FooterTab.Settings}
			>
				Settings
			</Button>
			<Button
				active={state.footerTab === FooterTab.API}
				data-tab={FooterTab.API}
			>
				API
			</Button>
		</div>
	)
}

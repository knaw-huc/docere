import React from 'react'
import { FooterTab, UIContext, DispatchContext, ProjectContext } from '@docere/common'

import { Button } from '..'

export function FooterTabs() {
	const dispatch = React.useContext(DispatchContext)
	const uiState = React.useContext(UIContext)
	const project = React.useContext(ProjectContext)

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
						{project.i18n[name]}
					</Button>
				)
			}
		</div>
	)
}

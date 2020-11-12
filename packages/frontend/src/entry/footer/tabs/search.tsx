import React from 'react'
import { useNavigate, SearchTab } from '@docere/common'

import { ProjectUIContext } from '../../../project/ui-context'
import { Button } from '..'

export function SearchTabs() {
	const { state, dispatch } = React.useContext(ProjectUIContext)
	const navigate = useNavigate()

	const onClick = React.useCallback(ev => {
		const { tab } = ev.target.dataset
		if (tab === SearchTab.Search) {
			navigate()
		} else {
			dispatch({ type: 'TOGGLE_TAB', tabType: 'search', tab })
		}
	}, [])

	return (
		<div
			className="search-tabs"
			onClick={onClick}
		>
			<Button
				active={state.searchTab === SearchTab.Search}
				data-tab={SearchTab.Search}
			>
					Search
			</Button>
			<Button
				active={state.searchTab === SearchTab.Results}
				data-tab={SearchTab.Results}
			>
				Results
			</Button>
		</div>
	)
}

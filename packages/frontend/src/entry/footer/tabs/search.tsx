import React from 'react'
import { SearchTab, getSearchPath, UIContext, DispatchContext, ProjectContext } from '@docere/common'

import { Button } from '..'
import { useHistory } from 'react-router-dom'

export function SearchTabs() {
	const history = useHistory()

	const dispatch = React.useContext(DispatchContext)
	const project = React.useContext(ProjectContext)
	const uiState = React.useContext(UIContext)

	const onClick = React.useCallback(ev => {
		const { tab } = ev.target.dataset
		if (tab === SearchTab.Search) {
			history.push(getSearchPath(project.config.slug))
		} else {
			dispatch({ type: 'TOGGLE_TAB', tabType: 'search', tab })
		}
	}, [project.config.slug])

	return (
		<div
			className="search-tabs"
			onClick={onClick}
		>
			<Button
				active={uiState.searchTab === SearchTab.Search}
				data-tab={SearchTab.Search}
			>
				{project.i18n.search}
			</Button>
			<Button
				active={uiState.searchTab === SearchTab.Results}
				data-tab={SearchTab.Results}
			>
				{project.i18n.results}
			</Button>
		</div>
	)
}

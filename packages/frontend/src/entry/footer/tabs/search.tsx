import React from 'react'
import { SearchTab, getSearchPath } from '@docere/common'

import { ProjectUIContext } from '../../../project/ui-context'
import { Button } from '..'
import { useHistory, useParams } from 'react-router-dom'

export function SearchTabs() {
	const history = useHistory()
	const { projectId } = useParams()
	const { state, dispatch } = React.useContext(ProjectUIContext)


	const onClick = React.useCallback(ev => {
		const { tab } = ev.target.dataset
		if (tab === SearchTab.Search) {
			history.push(getSearchPath(projectId))
		} else {
			dispatch({ type: 'TOGGLE_TAB', tabType: 'search', tab })
		}
	}, [projectId])

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

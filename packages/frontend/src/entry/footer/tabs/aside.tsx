import React from 'react'
import { AsideTab, AsideTabContext, EntryContext, DispatchContext } from '@docere/common'
import { Button } from '..'

export function AsideTabs() {
	const dispatch = React.useContext(DispatchContext)
	const entry = React.useContext(EntryContext)
	const asideTab = React.useContext(AsideTabContext)

	const handleTabClick = React.useCallback(ev => {
		const { tab } = ev.target.dataset
		dispatch({
			type: 'SET_ASIDE_TAB',
			tab: asideTab === tab ? undefined : tab,
		})
	}, [asideTab])

	return (
		<div className="aside-tabs">
			{
				entry.metadata.size &&
				<Button
					active={asideTab === AsideTab.Metadata}
					data-tab={AsideTab.Metadata}
					onClick={handleTabClick}
				>
					Metadata
				</Button>
			}
			{
				entry.textData.entities.size > 0 &&
				<Button
					active={asideTab === AsideTab.TextData}
					data-tab={AsideTab.TextData}
					onClick={handleTabClick}
				>
					Entities
				</Button>
			}
		</div>
	)
}

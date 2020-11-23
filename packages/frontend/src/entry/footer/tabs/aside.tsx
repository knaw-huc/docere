import React from 'react'
import { AsideTab, EntryTabContext, EntryContext } from '@docere/common'
import { Button, isEmpty } from '..'

// TODO move entry to EntryContext
export function AsideTabs() {
	const entry = React.useContext(EntryContext)
	const { asideTab, setAsideTab } = React.useContext(EntryTabContext)

	const handleTabClick = React.useCallback(ev => {
		const { tab } = ev.target.dataset
		setAsideTab(asideTab === tab ? undefined : tab)
	}, [asideTab])

	return (
		<div className="aside-tabs">
			{
				!isEmpty(entry.metadata) &&
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
			{/* {
				!isEmpty(props.entry.notes) &&
				<Button
					active={props.asideTab === AsideTab.Notes}
					data-tab={AsideTab.Notes}
					data-type="aside"
				>
					Notes
				</Button>
			} */}
		</div>
	)
}

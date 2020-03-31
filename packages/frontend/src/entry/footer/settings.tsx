import * as React from 'react'
import styled from 'styled-components'
import { BottomTabWrapper } from './layers'
import Option from './options'
import type { DocereConfig, EntryStateAction } from '@docere/common'

interface Option { prop: keyof DocereConfig['entrySettings'], title: string }
const textOptions: Option[] = [
	{
		prop: 'panels.text.showLineBeginnings',
		title: 'Show line numbers'
	},
	{
		prop: 'panels.text.showPageBeginnings',
		title: 'Show facsimile thumbnails'
	},
	{
		prop: 'panels.text.showMinimap',
		title: 'Show minimap'
	},
	{
		prop: 'panels.text.showEntities',
		title: 'Show entities'
	},
	{
		prop: 'panels.text.showNotes',
		title: 'Show notes'
	},
	{
		prop: 'panels.text.openPopupAsTooltip',
		title: 'Open popup as tooltip'
	},
]

const panelsOptions: Option[] = [
	{
		prop: 'panels.showHeaders',
		title: 'Show panel headers',
	}
]

const OptionLists = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	
	& > ul {
		columns: 2;
	}
`

interface Props {
	active: boolean
	dispatch: React.Dispatch<EntryStateAction>
	entrySettings: DocereConfig['entrySettings']
}
function Layers(props: Props) {
	const toggleSettingsProperty = React.useCallback(ev => {
		const property = ev.currentTarget.dataset.prop
		props.dispatch({ type: 'TOGGLE_SETTINGS_PROPERTY', property })
	}, [])

	return (
		<BottomTabWrapper active={props.active}>
			<OptionLists>
				<ul>
					{
						textOptions.map(option =>
							<Option
								checked={props.entrySettings[option.prop]}
								key={option.prop}
								onClick={toggleSettingsProperty}
								option={option}
							/>
						)
					}
				</ul>
				<ul>
					{
						panelsOptions.map(option =>
							<Option
								checked={props.entrySettings[option.prop]}
								key={option.prop}
								onClick={toggleSettingsProperty}
								option={option}
							/>
						)
					}
				</ul>
			</OptionLists>
		</BottomTabWrapper>
	)
}

export default React.memo(Layers)

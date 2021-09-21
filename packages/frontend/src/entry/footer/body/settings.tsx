import * as React from 'react'
import styled from 'styled-components'
import { BottomTabWrapper } from './layers'
import Option from './options'
import { DocereConfig, EntrySettingsContext, DispatchContext } from '@docere/common'

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
		prop: 'panels.entities.show',
		title: 'Show entities'
	},
	// {
	// 	prop: 'panels.entities.toggle',
	// 	title: 'Toggle entities'
	// },
	// {
	// 	prop: 'panels.text.showNotes',
	// 	title: 'Show notes'
	// },
	// {
	// 	prop: 'panels.text.openPopupAsTooltip',
	// 	title: 'Open popup as tooltip'
	// },
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
}
function Layers(props: Props) {
	const dispatch = React.useContext(DispatchContext)
	const settings = React.useContext(EntrySettingsContext)

	const toggleSettingsProperty = React.useCallback(ev => {
		const property = ev.currentTarget.dataset.prop
		dispatch({
			type: 'TOGGLE_ENTRY_SETTING',
			property,
		})
	}, [])

	return (
		<BottomTabWrapper active={props.active}>
			<OptionLists>
				<ul>
					{
						textOptions.map(option =>
							<Option
								checked={settings[option.prop]}
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
								checked={settings[option.prop]}
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

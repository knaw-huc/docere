import React from 'react'
import styled from 'styled-components'
import { Pb, Lb, Hi, Paragraph, Space, EntityTag, NoteTag } from '@docere/text-components'
import { Colors, EntrySettingsContext } from '@docere/common'

import type { ComponentProps, DocereConfig } from '@docere/common'

function MondrianLb(props: ComponentProps) {
	const { settings } = React.useContext(EntrySettingsContext)
	return (
		<>
			<Lb />
			{
				settings['panels.text.showLineBeginnings'] &&
				props.attributes.rend?.indexOf('indent') > -1 &&
				<span>&nbsp;&nbsp;</span>
			}
		</>
	)
}

const AddWrapper = styled.span`
	color: ${(props: { hasLb: boolean }) => props.hasLb ? Colors.Green : 'initial'};
`
function Add(props: { children: React.ReactNode }) {
	const { settings } = React.useContext(EntrySettingsContext)
	return (
		<AddWrapper hasLb={settings["panels.text.showLineBeginnings"]}>
			{props.children}
		</AddWrapper>
	)
}

const DelWrapper = styled.span`
	color: ${Colors.Red};
	display: ${(props: { hasLb: boolean }) => props.hasLb ? 'inline' : 'none'};
`
function Del(props: { children: React.ReactNode} ) {
	const { settings } = React.useContext(EntrySettingsContext)

	return (
		<DelWrapper hasLb={settings["panels.text.showLineBeginnings"]}>
			{props.children}
		</DelWrapper>
	)
}

export default async function entryComponents(_config: DocereConfig) {
	return {
		// Show <add> in green in the diplomatic version and in default color in the read version
		add: Add,

		// Show <del> in red in the diplomatic version and hide in the read version
		del: Del,

		lb: MondrianLb,

		pb: Pb,


		hi: Hi,

		p: Paragraph,

		'[*|type="editor"]': NoteTag,
		'[*|type="bio"]': EntityTag,
		'[*|type="biblio"]': EntityTag,
		'[*|type="rkd-artwork-link"]': EntityTag,

		space: Space,
	}
}

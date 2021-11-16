import React from 'react'
import styled from 'styled-components'
import { Pb, Lb, Hi, Paragraph, Space, EntityTag } from '@docere/text-components'
import { Colors, EntrySettingsContext, Tooltip } from '@docere/common'

import type { ComponentProps, DocereConfig } from '@docere/common'
import { EntityTooltip } from '@docere/text-components/src/entity/entity-tooltip'

function MondrianLb(props: ComponentProps) {
	const settings = React.useContext(EntrySettingsContext)
	return (
		<>
			<Lb />
			{
				settings['panels.text.showLineBeginnings'] &&
				props.annotation.sourceProps.rend?.indexOf('indent') > -1 &&
				<span>&nbsp;&nbsp;</span>
			}
		</>
	)
}

const AddWrapper = styled.span`
	color: ${(props: { hasLb: boolean }) => props.hasLb ? Colors.Green : 'initial'};
`
function Add(props: ComponentProps) {
	const settings = React.useContext(EntrySettingsContext)
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
function Del(props: ComponentProps ) {
	const settings = React.useContext(EntrySettingsContext)

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

		// TODO restore note
		ptr: Note,
		ref: EntityTag,
		rs: EntityTag,
		// 'ptr[type="note"][target]': EntityTag,
		// 'ref[target^="bio.xml#"]': EntityTag,
		// 'ref[target^="biblio.xml#"]': EntityTag,
		// 'rs[type="artwork-m"][key]': EntityTag,

		space: Space,

		choice: Choice,
		sic: Sic,
		corr: Corr,
	}
}

function Note(props: ComponentProps) {
	return (
		<EntityTag {...props}>{props.annotation?.props.entityOrder}</EntityTag>
	)
}

function Sic(props: any) {
	return (
		<Tooltip color="#666">
			<header>{props.annotation.sourceProps.type}</header>
			<div className="body">
				{props.children}
			</div>
		</Tooltip>
	)
}

const Choice = styled.span`
	cursor: pointer;
	display: inline-block;
	position: relative;
	text-decoration-color: #666;
	text-decoration-line: underline;
	text-decoration-style: wavy;
	text-decoration-thickness: 1px;
	text-underline-offset: 3px;

	.tooltip {
		display: none;
		width: 200px;
		text-align: center;
		margin-left: calc(50% - 100px);
		margin-top: 2.7rem;

		header {
			background: #666;
			color: white;
			line-height: 1.2rem;
		}

		.body {
			background: #EEE;
			color: black;
			font-size: 1rem;
			padding: .5rem 0;
		}		
	}

	&:hover .tooltip {
		display: block;
	}
`

const Corr = styled.span`
`

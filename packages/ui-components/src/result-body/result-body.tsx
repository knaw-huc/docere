import React from 'react'
import styled from 'styled-components'
import { SearchTab, Colors } from '@docere/common'

import { FacsimileThumbs } from './facsimile-thumbs'

import type { DocereResultBodyProps } from '@docere/common'

interface WProps {
	active: boolean
	hasFacsimile: boolean
	small: boolean
}
const Wrapper = styled.div`
	border-left: 3px solid white;
	border-right: 3px solid white;
	border-bottom: 3px solid #EEE;
	display: grid;
	font-size: ${(props: WProps) => props.small ? '.8em' : '1em'};
	grid-column-gap: ${(props: WProps) => props.small ? 32 / 2 : 32}px;
	grid-template-columns: ${(props: WProps) => props.hasFacsimile ?
		'76px auto' :
		'auto'
	};
	padding: 1.5em 0;
	transition: all 350ms;

	${(props: WProps) => {
		if (props.active) {
			return `
				border-left-color: ${Colors.Orange};
				border-right-color: ${Colors.Orange};
				padding: 1.5em;
			`
		} else {
			return `
				&:hover {
					background: #EEE4;
					border-bottom: 3px solid #CCC;
				}
			`
		}
	}}
`

const Snippets = styled.ul`
	color: #444;
	font-size: .66em;	
	grid-column: 1 / span 3;
	margin-top: 1em;

	em {
		color: black;
		font-weight: bold;
	}
`

export const ResultBody = React.memo(function ResultBody(props: DocereResultBodyProps) {
	const small = props.searchTab === SearchTab.Results

	return (
		<Wrapper
			active={props.result.id === props.activeId}
			hasFacsimile={props.result.hasOwnProperty('facsimiles') && props.result.facsimiles.length > 0}
			small={small}
		>
			<FacsimileThumbs
				activeResult={props.result.id === props.activeId}
				activeFacsimile={props.facsimile}
				entryId={props.result.id}
				facsimiles={props.result.facsimiles}
				small={small}
			/>
			<div>{props.children}</div>
			{
				props.result.snippets?.length > 0 &&
				<Snippets>
					{props.result.snippets.map((snippet, index) =>
						<li dangerouslySetInnerHTML={{ __html: `...${snippet}...` }}  key={index} />
					)}
				</Snippets>
			}
		</Wrapper>
	)
})

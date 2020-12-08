import * as React from 'react'
import styled, { css } from 'styled-components'
import { ResultBody } from '@docere/ui-components'
import type { DocereResultBodyProps } from '@docere/common'

const Bold = styled.div`
	font-weight: bold;
	margin-bottom: .5rem;

	& > span {
		color: #888;
		font-weight: normal;
		margin: 0 .5rem;
	}
`

const liSplitter = css`
	& > li {
		display: inline-block;

		&:not(:last-of-type):after {
			content: '|';
			padding: 0 .5em;
		}
	}
`

const Small = styled.ul`
	color: #666;
	font-size: .8rem;
	margin-bottom: .5rem;
	${liSplitter}
`

const Normal = styled.ul`
	${liSplitter}
`

function formatList(items: string[], label: string) {
	if (!Array.isArray(items) || !items.length) return null
	const s = items.length > 1 ? 's' : ''
	return `${items.length} ${label}${s}`
}

function GheysResultBody(props: DocereResultBodyProps) {
	const small = [`${props.result.blocks} blocks`, `${props.result.chars} characters`]
	const normal = [
		formatList(props.result.person, 'person'),
		formatList(props.result.location, 'location'),
		formatList(props.result.job, 'job'),
		formatList(props.result.good, 'good'),
		formatList(props.result.ship, 'ship'),
	].filter(x => x != null)

	return (
		<ResultBody {...props}>
			<Bold>
				{props.result.toegang_level0}
				<span>&gt;</span>
				{props.result.toegang_level1}
				<span>&gt;</span>
				{props.result.toegang_level2}
				<span>&gt;</span>
				{props.result.n}
			</Bold>
			<Small>{small.map(s => <li key={s}>{s}</li>)}</Small>
			<Normal>{normal.map(n => <li key={n}>{n}</li>)}</Normal>
		</ResultBody>
	)
}


export const SearchResult = React.memo(GheysResultBody)

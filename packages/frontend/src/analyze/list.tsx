import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { getPath, useUrlObject, getEntryApiPath } from '@docere/common'

import type { AnalyzeStateAction, AddSelected } from './state'

const ALink = styled(Link)`
	color: gray;
	padding: 0 .2rem;

	&:before { content: '['; }
	&:after { content: ']'; }
`

type ItemProps = Pick<Props, 'dispatch' | 'id' | 'title'> & {
	projectId: string
	value: string
}
function Item(props: ItemProps) {
	return (
		<li
			onClick={() => props.dispatch({ type: 'ADD_SELECTED', type2: props.id, value: props.value })}
		>
			{
				props.title === 'Documents' ?
					<>
						{props.value}
						<span onClick={ev => ev.stopPropagation()}>
							<ALink to={getPath({ projectId: props.projectId, entryId: props.value })} target="_blank">w</ALink>
							<ALink to={getEntryApiPath(props.projectId, props.value, 'original')} target="_blank">xo</ALink>
							<ALink to={getEntryApiPath(props.projectId, props.value, 'prepared')} target="_blank">xp</ALink>
						</span>
					</> :
					props.value	
			}
		</li>
	)
}

interface Props {
	activeValues: string[]
	dispatch: React.Dispatch<AnalyzeStateAction>
	id: AddSelected['type2']
	selectedValues: string[]
	title: string
	values: string[]
}
export function SearchList(props: Props) {
	const { projectId } = useUrlObject()

	return (
		<>
			<h3>{props.title}</h3>

			<ul className="selected">
				{
					props.selectedValues
						.map((v, i) =>
							<Item 
								dispatch={props.dispatch}
								id={props.id}
								key={i}
								projectId={projectId}
								title={props.title}
								value={v}
							/>
						)
				}
			</ul>
			<ul className="active">
				{
					props.activeValues
						.filter(v => props.selectedValues.indexOf(v) === -1)
						.map((v, i) => 
							<Item 
								dispatch={props.dispatch}
								id={props.id}
								key={i}
								projectId={projectId}
								title={props.title}
								value={v}
							/>
						)
				}
			</ul>
			<ul className="rest">
				{
					props.values
						.filter(v => props.selectedValues.indexOf(v) === -1 && props.activeValues.indexOf(v) === -1)
						.map((v, i) =>
							<Item 
								dispatch={props.dispatch}
								id={props.id}
								key={i}
								projectId={projectId}
								title={props.title}
								value={v}
							/>
						)
				}
			</ul>
		</>
	)
}

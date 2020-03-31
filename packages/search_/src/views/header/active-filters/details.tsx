import * as React from 'react'
import DropDown from '../../ui/drop-down'
import styled from 'styled-components'
import type { FacetsDataReducerAction, ActiveFilter } from '@docere/common'

const ActiveFiltersDropDown = styled(DropDown)`
	.huc-fs-dropdown-button {
		margin: 0 .5em;
		text-align: right;
	}

	.huc-fs-dropdown-body {
		box-sizing: border-box;
		right: 0;
		width: calc(100% - 32px);

		& > ul > li {
			display: grid;
			grid-template-columns: 140px auto;

			& > ul > li {
				cursor: pointer;
				display: inline-block;
				background: #EEE;
				margin-right: .5rem;
				margin-bottom: .3rem;
				line-height: 1rem;
				padding: 0 .35rem;

				&:hover {
					color: #444;
				}
			}

			&:not(:last-of-type) {
				border-bottom: 1px solid #eee;
			}
		}
	}
`

interface Props {
	clearFullTextInput: () => void
	dispatch: React.Dispatch<FacetsDataReducerAction>
	filters: ActiveFilter[]
	query: string
}
function ActiveFiltersDetails(props: Props) {
	return (
		<ActiveFiltersDropDown
			label={`active (${props.filters.reduce((p, c) => p + c.values.length, !props.query.length ? 0 : 1)})`}
			z={1001}
		>
			<ul>
				{
					props.query.length > 0 &&
					<li>
						<div>Full text query</div>
						<ul>
							<li
								onClick={ev => {
									ev.stopPropagation()
									props.clearFullTextInput()
								}}
							>
								{props.query}
							</li>		
						</ul>
					</li>
				}
				{
					props.filters.map(filter =>
						<li key={filter.id}>
							<div>{filter.title}</div>
							<ul>
								{
									filter.values.map(value =>
										<li
											key={value}
											onClick={ev => {
												ev.stopPropagation()
												props.dispatch({ type: 'remove_filter', facetId: filter.id, value })
											}}
										>
											{value}
										</li>		
									)
								}
							</ul>
						</li>
					)
				}
			</ul>
		</ActiveFiltersDropDown>
	)
}

export default React.memo(ActiveFiltersDetails)

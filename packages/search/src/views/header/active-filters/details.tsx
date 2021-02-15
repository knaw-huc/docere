import React from 'react'
import styled from 'styled-components'

import { FacetsDataReducerAction, ActiveFilter } from '@docere/common'

const Ul = styled.ul`
	& > li {
		box-sizing: border-box;
		cursor: pointer;
		display: grid;
		grid-template-columns: auto auto;
		padding: .35rem 0 .1rem 0;

		& > .title {
			margin-right: .25rem;
		}

		& > ul {
			display: flex;
			justify-content: flex-end;
			flex-wrap: wrap;

			& > li {
				cursor: pointer;
				background: #EEE;
				border: 1px solid #EEE;
				border-radius: .125rem;
				padding: 0 .2rem;
				margin: 0 0 .2rem .2rem;

				&:hover {
					border-color: #BBB;

					&:after {
						color: #444;
					}
				}

				&:after {
					content: '✕';
					color: #888;
					font-size: 0.6rem;
					padding-left: .1rem;
				}
			}
		}

		&:not(:last-of-type) {
			border-bottom: 1px solid #eee;
		}
	}
`

interface Props {
	dispatch: React.Dispatch<FacetsDataReducerAction>
	filters: ActiveFilter[]
	query: string
}
function ActiveFiltersDetails(props: Props) {
	const removeSearchFilter = React.useCallback(ev => {
		ev.stopPropagation()
		const { facetId, value } = ev.currentTarget.dataset
		props.dispatch({ type: 'REMOVE_FILTER', facetId, value })
	}, [])

	return (
		<Ul>
			{
				props.filters.map(filter =>
					<li key={filter.id}>
						<div className="title">{filter.title}</div>
						<ul>
							{
								filter.values.map(value =>
									<li
										data-facet-id={filter.id}
										data-value={value}
										key={value}
										onClick={removeSearchFilter}
									>
										{value}
									</li>		
								)
							}
						</ul>
					</li>
				)
			}
		</Ul>
	)
}

export default React.memo(ActiveFiltersDetails)

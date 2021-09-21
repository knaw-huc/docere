import React from 'react'
import styled from 'styled-components'
import { SearchContext } from '../../search/context'
import { SPOT_COLOR, SPOT_COLOR_ACTIVE } from '../../constants'

import type { ValueProps } from './string/value'
import { isListFacetData, isRangeFacetData } from '../../search/guards'

const Wrapper = styled.div`
	align-self: end;
	color: #444;
	cursor: pointer;
	display: grid;
	font-size: .75em;
	grid-template-columns: auto auto;
	margin-left: 1em;
	white-space: nowrap;

	&:hover {
		.buttons {
			display: block;
		}
	}

	svg {
		align-self: center;
		fill: ${(props: { active: boolean }) => props.active ? SPOT_COLOR_ACTIVE : SPOT_COLOR };
		height: 1rem;
		transition: fill 150ms;
		width: 12px;
	}
`

const Buttons = styled.div`
	color: #666;
	display: none;
	height: 1rem;

	button {
		background-color: #EEE;
		border-radius: .1rem;
		border: 1px solid #DDD;
		color: ${SPOT_COLOR};
		cursor: pointer;
		display: inline-block;
		margin: 0 6px;
		padding: 0 .2rem;
		text-align: center;

		&:hover {
			border-color: #AAA;
		}

		span {
			color: #666;
			font-size: .5rem;
			margin-right: 6px;
		}
	}
`

export function SearchControls(props: ValueProps) {
	const searchContext = React.useContext(SearchContext)

	// TODO move active to method (isActive?) on Facet object? 
	const active = isListFacetData(props.facet) ?
		props.facet.filters.has(props.value) :
		isRangeFacetData(props.facet) ?
			props.facet.filters.length > 0 :
			false

	const onClick = React.useCallback(ev => {
		ev.stopPropagation()

		const { facetId, value } = ev.currentTarget.dataset
		const type: 'ADD_FILTER' | 'SET_FILTER' | 'REMOVE_FILTER' = ev.currentTarget.dataset.type

		searchContext.dispatch({
			type,
			facetId,
			value
		})
	}, [])

	return (
		<Wrapper active={active}>
			<svg 
				viewBox="0 0 250.313 250.313">
				<path d="M244.186,214.604l-54.379-54.378c-0.289-0.289-0.628-0.491-0.93-0.76 c10.7-16.231,16.945-35.66,16.945-56.554C205.822,46.075,159.747,0,102.911,0S0,46.075,0,102.911 c0,56.835,46.074,102.911,102.91,102.911c20.895,0,40.323-6.245,56.554-16.945c0.269,0.301,0.47,0.64,0.759,0.929l54.38,54.38 c8.169,8.168,21.413,8.168,29.583,0C252.354,236.017,252.354,222.773,244.186,214.604z M102.911,170.146 c-37.134,0-67.236-30.102-67.236-67.235c0-37.134,30.103-67.236,67.236-67.236c37.132,0,67.235,30.103,67.235,67.236 C170.146,140.044,140.043,170.146,102.911,170.146z" />
			</svg>
			<Buttons className="buttons">
				{
					!active ?
						<>
							<button
								className="add-filter"
								data-facet-id={props.id}
								data-type="ADD_FILTER"
								data-value={props.value}
								onClick={onClick}
								title={`Add '${props.value}' to active search filters.`}
							>
								add
							</button>
							/
							<button
								className="set-filter"
								data-facet-id={props.id}
								data-type="SET_FILTER"
								data-value={props.value}
								onClick={onClick}
								title={`Clear search and set '${props.value}' as active search filter.`}
							>
								set
							</button>
						</> :
						<button
							className="remove-filter"
							data-facet-id={props.id}
							data-type="REMOVE_FILTER"
							data-value={props.value}
							onClick={onClick}
							title={`Remove '${props.value}' from active search filters.`}
						>
							<span>✕</span>
							remove
						</button>
				}
				filter
			</Buttons>
		</Wrapper>
	)
}

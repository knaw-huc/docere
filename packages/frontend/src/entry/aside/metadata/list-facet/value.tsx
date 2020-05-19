import * as React from 'react'
import styled from 'styled-components'
import { SPOT_COLOR } from '@docere/common'

import MetadataValue from '../value'

type LMVProps = Pick<Props, 'active'>
const Wrapper = styled.div`
	display: grid;
	grid-template-columns: fit-content(70%) fit-content(30%);

	& > span:nth-of-type(2) {
		align-self: end;
		color: #444;
		font-size: .75em;
		margin-left: 1em;

		&:hover {
			.buttons > span {
				width: 26px;
			}

			.buttons > span:hover {
				color: #EEE;
			}

			svg {
				fill: ${(props: LMVProps) => props.active ? SPOT_COLOR : '#CCC'};
			}
		}

		svg {
			align-self: center;
			cursor: ${props => props.active ? 'pointer' : 'default'};
			fill: ${props => props.active ? SPOT_COLOR : '#444'};
			height: 12px;
			margin-right: 6px;
			transition: fill 150ms;
			width: 12px;
		}

		.buttons > span {
			cursor: pointer;
			display: inline-block;
			overflow: hidden;
			transition: width 150ms;
			width: 0;
		}

		& > span:first-of-type {
			margin-right: 6px;
		}
	}
`
interface Props {
	active: boolean
	children: React.ReactNode
	id: string
	onClick: (ev: any) => void
}
export default function Value(props: Props) {
	const svg = (
		<svg 
			viewBox="0 0 250.313 250.313">
			<path d="M244.186,214.604l-54.379-54.378c-0.289-0.289-0.628-0.491-0.93-0.76 c10.7-16.231,16.945-35.66,16.945-56.554C205.822,46.075,159.747,0,102.911,0S0,46.075,0,102.911 c0,56.835,46.074,102.911,102.91,102.911c20.895,0,40.323-6.245,56.554-16.945c0.269,0.301,0.47,0.64,0.759,0.929l54.38,54.38 c8.169,8.168,21.413,8.168,29.583,0C252.354,236.017,252.354,222.773,244.186,214.604z M102.911,170.146 c-37.134,0-67.236-30.102-67.236-67.235c0-37.134,30.103-67.236,67.236-67.236c37.132,0,67.235,30.103,67.235,67.236 C170.146,140.044,140.043,170.146,102.911,170.146z" />
		</svg>
	)

	return (
		<Wrapper active={props.active}>
			<MetadataValue
				active={props.active}
			>
				{props.children}
			</MetadataValue>
			<span>
				{
					props.active ?
					<span
						data-facet-id={props.id}
						data-type="REMOVE_FILTER"
						data-value={props.children}
						onClick={props.onClick}
						title={`Remove '${props.children}' from currently active search filters and trigger a new search.`}
					>
						{svg}
					</span> :
					<span>{svg}</span>
				}
				{
					!props.active &&
					<span className="buttons">
						<span
							data-facet-id={props.id}
							data-type="ADD_FILTER"
							data-value={props.children}
							onClick={props.onClick}
							title={`Add '${props.children}' to currently active search filters and trigger a new search.`}
						>
							add
						</span>
						<span
							data-facet-id={props.id}
							data-type="SET_FILTER"
							data-value={props.children}
							onClick={props.onClick}
							title={`Set '${props.children}' as the only active search filter and trigger a new search.`}
						>
							set
						</span>
					</span>
				}
			</span>
		</Wrapper>
	)
}

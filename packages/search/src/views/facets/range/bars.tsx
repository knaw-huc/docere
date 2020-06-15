import React from 'react'
import styled from 'styled-components';
import { Colors } from '@docere/common'

import SearchContext from '../../../facets-context'

import type { RangeFacetData, DateFacetData, RangeFacetValue } from '@docere/common'

const BAR_HEIGHT = 36;
const BAR_WIDTH = 300;

const Wrapper = styled.div`
	position: relative;
`

const RemoveFilterButton = styled.div`
	position: absolute;
    height: 18px;
    width: 30px;
    color: ${Colors.BlueBright};
    right: -30px;
    text-align: center;
    top: 16px;
    cursor: pointer;
`

interface BarProps {
	activeArea: RangeFacetValue
	filter: RangeFacetValue
	row: number
}
function Bar(props: BarProps) {
	if (props.filter == null) return null

	return (
		<svg
			y={(props.row - 1) * BAR_HEIGHT}
		>
			<text
				fill={props.activeArea == null ? '#444' : '#888'}
				fontSize={props.activeArea == null ? '.9rem' : '.8rem'}
				x="0"
				y={BAR_HEIGHT - 4}
			>
				{props.filter.fromLabel}
			</text>
			<text
				fill={props.activeArea == null ? '#444' : '#888'}
				fontSize={props.activeArea == null ? '.9rem' : '.8rem'}
				textAnchor="end"
				x={BAR_WIDTH}
				y={BAR_HEIGHT - 4}
			>
				{props.filter.toLabel}
			</text>
			{
				props.activeArea != null &&
				<>
					<line x1="0" x2={BAR_WIDTH} y1={BAR_HEIGHT} y2={BAR_HEIGHT} stroke={`${Colors.Orange}66`} strokeWidth="2"/>
					<ActiveArea activeArea={props.activeArea} filter={props.filter} />
				</>
			}
		</svg>
	)
}

type ActiveAreaProps = Omit<BarProps, 'row'>
function ActiveArea({ activeArea, filter }: ActiveAreaProps) {
	const delta = (filter.to - filter.from)
	const x1 = ((activeArea.from - filter.from) / delta) * BAR_WIDTH 
	const x2 = ((activeArea.to - filter.from) / delta) * BAR_WIDTH

	return (
		<g>
			<line x1={x1} x2={x2} y1={BAR_HEIGHT} y2={BAR_HEIGHT} stroke={Colors.Orange} strokeWidth="3"/>
			<polygon points={`0 0 ${x1} ${BAR_HEIGHT} ${x2} ${BAR_HEIGHT} ${BAR_WIDTH} 0`} fill="url(#myGradient)" />
		</g>
	)
}

interface Props {
	facetData: RangeFacetData | DateFacetData
}
export default function Bars({ facetData }: Props) {
	const searchContext = React.useContext(SearchContext)

	const setRange = React.useCallback(() => {
		if (facetData.filters.length < 2) {
			searchContext.dispatch({
				type: 'REMOVE_FILTER',
				facetId: facetData.config.id,
			})
		} else {
			searchContext.dispatch({
				type: 'SET_FILTER',
				facetId: facetData.config.id,
				value: facetData.filters[facetData.filters.length - 2] 
			})
		}
	}, [facetData.config.id])

	return (
		<Wrapper>
			{
				facetData.filters.length > 0 &&
				<RemoveFilterButton
					onClick={setRange}
					title="Remove filter"
				>
					✖
				</RemoveFilterButton>
			}
			<svg viewBox={`0 0 ${BAR_WIDTH} ${(facetData.filters.length + 1) * BAR_HEIGHT}`}>
				<defs>
					<linearGradient id="myGradient" gradientTransform="rotate(90)">
						<stop offset="0%"  stopColor={`${Colors.Orange}00`}  />
						<stop offset="100%" stopColor={`${Colors.Orange}66`} />
					</linearGradient>
				</defs>
				{
					facetData.filters.map((filter, index) => 
						<Bar
							activeArea={facetData.filters[index + 1]}
							key={index}
							filter={filter}
							row={-1 * index + facetData.filters.length} /* with length 3: index 0 => row 3, index 1 => row 2, index 2 => row 1, the end */
						/>
					)
				}
				<Bar row={facetData.filters.length + 1} filter={facetData.value} activeArea={facetData.filters[0]} />
			</svg>
		</Wrapper>
	)
}

			{/* <line x1="0" x2="300" y1="60" y2="60" stroke={`${Colors.Orange}66`} strokeWidth="2"/>
			<line x1="0" x2="300" y1="119" y2="119" stroke={`${Colors.Orange}66`} strokeWidth="2"/> */}
			{/* <text x="0" y="54">1000</text>
			<text textAnchor="end" x="300" y="54">2000</text>
			<text x="0" y="114">0</text>
			<text textAnchor="end" x="300" y="114">14000</text> */}

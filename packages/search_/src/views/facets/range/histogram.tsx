import React from 'react'
import styled from 'styled-components'
import { Colors, RangeFacetValue } from '@docere/common'

import SearchContext from '../../../facets-context'

import type { RangeFacetProps } from '.'
import { isRangeFacetData } from '../../../utils'

interface WrapperProps { barCount: number }
const Wrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(${(props: WrapperProps) => props.barCount}, 1fr);
	grid-column-gap: 4px;
	position: relative;
`

interface BarProps { active: boolean }
const Bar = styled.div`
	align-items: end;
	border: 1px solid white;
	box-sizing: border-box;
	height: 100%;
	cursor: ${(props: BarProps) => props.active ? 'pointer' : 'default'}};
	display: grid;

	${props =>
		props.active ? `
			&:hover {
				border: 1px solid ${Colors.BlueBright};
				& > div {
					background: ${Colors.BlueBright};
				}
			}
		` : ''
	}
`

interface BarFillProps { height: number }
const BarFill = styled.div`
	background: #DDD;
	height: ${(props: BarFillProps) => {
		let height = props.height
		if (height > 0 && height < .03) height = .03 /* Set minimum height to 3px */
		return `${height * 60}px`
	}};
`

const BarData = styled.div`
	color: ${Colors.Orange};
	font-size: .8rem;
	position: absolute;
`
const ActiveCount = styled(BarData)`
	width: 80px;
	left: -86px;
	text-align: right;
`

const ActiveRange = styled(BarData)`
	bottom: -20px;
	width: 100%;
	text-align: center;
`

function isActiveBar(value: RangeFacetValue, props: Props) {
	const hasCount = value != null && value.count > 0

	const spec = isRangeFacetData(props.facetData) ?
		// If the bar is from a range facet, the user can drill down further
		// if the interval is bigger than 1 or there are more props.values.
		// The range facet's values are integers, so lower than 1 is impossible,
		// but if there are still more values, it should be possible to drill down
		// to that value. If that integer is the only value, drilling down should 
		// be no longer possible
		(props.facetData.interval > 1 || props.values.length > 1) :

		// If the bar is a date facet, it needs more than 1 props.values to be able
		// to drill down. 
		props.values.length > 1

	return hasCount && spec
}

function formatRange(value: RangeFacetValue, isRangeFacet: boolean) {
	if (isRangeFacet && value.from === value.to - 1) return value.fromLabel
	return `${value.fromLabel} - ${value.toLabel}`
}

type Props = Pick<RangeFacetProps, 'facetData' | 'values'>
function Histogram(props: Props) {
	const searchContext = React.useContext(SearchContext)
	const counts = props.values.map(v => v.count)
	const maxCount = Math.max(...counts)
	if (!maxCount) return null

	const [activeValue, setActiveValue] = React.useState<RangeFacetValue>(null)

	const isRangeFacet = isRangeFacetData(props.facetData)

	const handleBarClick = React.useCallback(() => {
		if (!isActiveBar(activeValue, props)) return
		searchContext.dispatch({
			type: 'SET_FILTER',
			facetId: props.facetData.config.id,
			value: activeValue,
		})
	}, [props.values.length, props.facetData.config.id, activeValue])

	return (
		<Wrapper
			barCount={props.values.length}
			onMouseOut={() => setActiveValue(null)}
		>
			{
				activeValue != null &&
				<>
					{
						activeValue.count > 0 &&
						<ActiveCount>{activeValue.count}</ActiveCount>
					}
					<ActiveRange>{formatRange(activeValue, isRangeFacet)}</ActiveRange>
				</>
			}
			{
				props.values.map((value, index) =>
					<Bar
						active={isActiveBar(value, props)}
						key={index}
						onClick={handleBarClick}
						onMouseOver={() => setActiveValue(value)}
					>
						<BarFill
							height={value.count/maxCount}
						/>
					</Bar>
				)
			}
		</Wrapper>
	)
}

export default React.memo(Histogram)

		// const nextValue = props.values.values[index + 1]
		// if (value.count === 0) return
		// const from = value.count
		// const to = nextValue != null ? nextValue.count : null
		// console.log(from, to)

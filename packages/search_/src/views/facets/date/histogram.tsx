import React from 'react'
import styled from 'styled-components'

import { getEndDate } from './utils'
import { DateFacetProps } from '.'

interface WrapperProps { barCount: number }
const Wrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(${(props: WrapperProps) => props.barCount}, 1fr);
	grid-column-gap: 4px;
`

interface BarProps { count: number }
const Bar = styled.div`
	align-items: end;
	border: 1px solid white;
	box-sizing: border-box;
	height: 100%;
	cursor: ${(props: BarProps) => props.count > 0 ? 'pointer' : 'default'}};
	display: grid;

	&:hover {
		border: 1px solid #b6b6b6;
		& > div {
			background: #b6b6b6;
		}
	}
`

interface BarFillProps { height: number }
const BarFill = styled.div`
	background: #e6e6e6;
	height: ${(props: BarFillProps) => {
		let height = props.height
		if (height > 0 && height < .03) height = .03 /* Set minimum height to 3px */
		return `${height * 100}px`
	}};
`

// TODO remove lower/upperlimit
type Props = Pick<DateFacetProps, 'facetData' | 'facetsDataDispatch' | 'values'>
function Histogram(props: Props) {
	const counts = props.values.map(v => v.count)
	const maxCount = Math.max(...counts)

	const handleBarClick = React.useCallback((ev: any) => {
		let { index } = ev.currentTarget.dataset
		index = parseInt(index, 10)
		const value = props.values[index]
		const from = value.key
		const to = getEndDate(value.key, props.facetData.interval)

		props.facetsDataDispatch({
			type: 'set_range',
			facetId: props.facetData.id,
			from,
			to,
		})
	}, [props.values])

	return (
		<Wrapper barCount={props.values.length}>
			{
				props.values.map((value, index) =>
					<Bar
						count={value.count}
						data-index={index}
						key={index}
						onClick={handleBarClick}
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

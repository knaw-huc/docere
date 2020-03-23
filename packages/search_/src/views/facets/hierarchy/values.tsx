import * as React from 'react'
import FacetValueView from './value'
import styled from 'styled-components'
import MoreLessButton from './more-less-buttons'

const DURATION = 500
const FRAME_DURATION = 16
function easeOutQuint(t: number): number { return 1+(--t)*t*t*t*t }

const Wrapper = styled('div')`
	overflow: hidden;
`

const List = styled('ul')`
	margin: 0;
	padding: 0;
`

function useAnimate(collapse: boolean, ref: React.MutableRefObject<HTMLDivElement>) {
	React.useEffect(() => {
		let elapsed = 0
		const listHeight = ref.current.getBoundingClientRect().height

		const interval = setInterval(() => {
			elapsed += FRAME_DURATION
			let ratio = easeOutQuint(elapsed/DURATION)
			if (collapse) ratio = 1 - ratio
			let currentHeight = `${listHeight * ratio}px`
			if (elapsed > DURATION) {
				currentHeight = !collapse ? 'auto' : '0'
				clearInterval(interval)
			}
			ref.current.style.height = currentHeight
		}, FRAME_DURATION)
	}, [collapse])
}

type Props = Pick<HierarchyFacetProps, 'facetData' | 'facetsDataDispatch' | 'values'> & { collapse: boolean }
function FacetValuesView(props: Props) {
	const ref = React.useRef()
	useAnimate(props.collapse, ref)

	return (
		<Wrapper ref={ref}>
			<List>
				{
					props.values.values
						.map(value =>
							<FacetValueView
								active={props.facetData.filters.has(value.key.toString())}
								facetData={props.facetData}
								facetsDataDispatch={props.facetsDataDispatch}
								key={value.key}
								value={value}
							/>
						)
				}
			</List>
			{
				<MoreLessButton
					facetData={props.facetData}
					facetsDataDispatch={props.facetsDataDispatch}
					values={props.values}
				/>
			}
		</Wrapper>
	)
}

export default React.memo(FacetValuesView)

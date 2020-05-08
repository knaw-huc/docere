import * as React from 'react'
import { formatDate, SearchContext, isDateFacetConfig } from '@docere/search_'

import MetadataValue from '../value'

import { DateMetadata, RangeFacetData, Colors, /* RangeFacetData */ } from '@docere/common'
import styled from 'styled-components'

interface TProps { count: number }
const Timeline = styled.div`
	display: grid;
	grid-template-columns: fit-content(25%) auto fit-content(25%);
	height: ${(props: TProps) => `${props.count + 1}em`};
`

const Values = styled.div`
	align-self: end;
	border-top: 1px solid ${Colors.Orange}80;
	height: 49%;
	margin: 0 .5em;
	position: relative;
`

interface VWProps { index: number, ratio: number }
const ValueWrapper = styled.div`
	font-size: .8em;
	padding-right: .4em;
	${(props: VWProps) => {
		// console.log(props.index, ((Math.abs(props.index) - 1) * 1.4) + .2)
		// console.log(props.index, ((Math.abs(props.index) - 1) * 1.4) + .2)
		return props.index > 0 ?
			`padding-top: ${((Math.abs(props.index) - 1) * 1.3) + .2}em;` :
			`padding-bottom: ${((Math.abs(props.index) - 1) * 1.3) + .2}em;
			top: ${(Math.abs(props.index) * -1.3) - .2}em;
			`
	}}
	position: absolute;
	white-space: nowrap;
	z-index: ${props => 1000 - Math.abs(props.index)};

	${props => 
		props.ratio > .5 ?
			`
				border-right: 2px solid ${Colors.Orange}40;
				right: ${100 - props.ratio * 100}%;
			` : 
			`
				border-left: 2px solid ${Colors.Orange}40;
				left: ${props.ratio * 100}%;
			`
	}

	& > span {
		background: #21283080;
		padding-left: .2em;
	}
`

const Min = styled.div`
	color: ${Colors.Orange};
	font-size: .66rem;
	align-self: center;
`

const Max = styled(Min)`
	left: initial;
`

interface Props {
	metadataItem: DateMetadata
}
export default function DateFacetValue(props: Props) {
	const searchContext = React.useContext(SearchContext)

	let { value } = props.metadataItem
	if (!Array.isArray(value)) value = [value]
	if (!value.length) return '-'

	const facet = (searchContext.state.facets?.get(props.metadataItem.id) as RangeFacetData)
	if (facet?.value == null) return null

	return (
		<Timeline count={value.length}>
			<Min>{facet.value.fromLabel}</Min>
			<Values>
			{
				value
					.sort((a, b) => a - b)
					.map((num, i) => {
						const ratio = (num - facet.value.from) / (facet.value.to - facet.value.from)

						// 0 => -1, 1 => 1, 2 => -2, 3 => 2, 4 => -3, 5 => 3
						const index = i % 2 === 0 ? (i / -2) - 1 : (i / 2) + .5
						console.log(i, index, num, new Date(num))
						
						return (
							<ValueWrapper
								index={index}
								key={i}
								ratio={ratio}
							>
								<MetadataValue
									active={
										facet.filters.length &&
										facet.filters[0].from <= num &&
										facet.filters[facet.filters.length - 1].to > num
									}
									flip={ratio > .5}
								>
									{
										isDateFacetConfig(props.metadataItem) ?
											formatDate(num, 'd') :
											num
									}
								</MetadataValue>
							</ValueWrapper>
						)
					})
			}
			</Values>
			<Max>{facet.value.toLabel}</Max>
		</Timeline>
	)
}

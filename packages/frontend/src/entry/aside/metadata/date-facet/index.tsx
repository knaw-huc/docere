import * as React from 'react'
import { formatDate, SearchContext, isDateFacetConfig } from '../../../../../../search/src'

import MetadataValue from '../value'

import { RangeFacetData, Colors, RangeMetadata, DateMetadata, /* RangeFacetData */ } from '@docere/common'
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
	metadataItem: DateMetadata | RangeMetadata
}
export default function DateFacetValue(props: Props) {
	const searchContext = React.useContext(SearchContext)

	const value = Array.isArray(props.metadataItem.value) ? props.metadataItem.value : [props.metadataItem.value]
	if (!value.length) return <>-</>

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

						const cutoff = Math.floor(value.length / 2)
						let index = (i + 1) <= cutoff ? i - cutoff : i - cutoff + 1
						if (value.length === 1) index = -1
						
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

import * as React from 'react'
import { formatDate, SearchContext, isDateFacetConfig } from '@docere/search_'

import MetadataValue from '../value'

import { DateMetadata, RangeFacetData, Colors, /* RangeFacetData */ } from '@docere/common'
import styled from 'styled-components'

interface TProps { count: number }
const Timeline = styled.div`
	border-top: 1px solid ${Colors.Orange}80;
	height: ${(props: TProps) => `${props.count + 1}em`};
	margin-top: 1.3em;
	position: relative;
`

interface VWProps { index: number, ratio: number }
const ValueWrapper = styled.div`
	font-size: .8em;
	padding-right: .4em;
	padding-top: ${(props: VWProps) => `${(props.index * 1.4) + .2}em`};
	position: absolute;
	white-space: nowrap;

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

const MinDate = styled.div`
	position: absolute;
	color: ${Colors.Orange};
	left: 0;
	font-size: .66rem;
	top: -1.4em;
`

const MaxDate = styled(MinDate)`
	left: initial;
	right: 0;
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
			<MinDate>{facet.value.fromLabel}</MinDate>
			<MaxDate>{facet.value.toLabel}</MaxDate>
			{
				value
					.sort((a, b) => b - a)
					.map((num, i) => {
						const ratio = (num - facet.value.from) / (facet.value.to - facet.value.from)
						
						return (
							<ValueWrapper
								index={value.length - 1 - i}
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
		</Timeline>
	)
}

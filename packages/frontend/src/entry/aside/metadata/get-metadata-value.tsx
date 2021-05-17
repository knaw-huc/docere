import React from 'react'
import { MetadataItem, DEFAULT_SPACING, StringMetadata } from '@docere/common'
import styled from 'styled-components'
import { isListFacetConfig, isHierarchyFacetConfig, isBooleanFacetConfig, isRangeFacetConfig, isDateFacetConfig } from '../../../../../search/src'

// import ListFacetValue from './list-facet'
import HierarchyFacetValue from './hierarchy-value'
import BooleanFacetValue from './boolean-value'
// import RangeFacetValue from './range-value'
import DateFacetValue from './date-facet'

const Wrapper = styled.li`
	margin-bottom: ${DEFAULT_SPACING}px;
`

const Title = styled.div`
	color: #888;
	display: block;
	font-size: .75rem;
	margin-bottom: .25rem;
	text-transform: uppercase;
`

interface Props {
	metadataItem: MetadataItem
}
export default function MetadataItemComp(props: Props) {
	return (
		<Wrapper>
			{
				isListFacetConfig(props.metadataItem) &&
				<StringMetadata
					metadataId={props.metadataItem.id}
					value={props.metadataItem.value}

				/>
			}
			{
				isHierarchyFacetConfig(props.metadataItem) &&
				<>
					<Title>{props.metadataItem.title}</Title>
					<HierarchyFacetValue
						metadataItem={props.metadataItem}
					/>
				</>
			}
			{
				isBooleanFacetConfig(props.metadataItem) &&
				<>
					<Title>{props.metadataItem.title}</Title>
					<BooleanFacetValue
						metadataItem={props.metadataItem}
					/>
				</>
			}
			{
				(isRangeFacetConfig(props.metadataItem) || isDateFacetConfig(props.metadataItem)) &&
				<>
					<Title>{props.metadataItem.title}</Title>
					<DateFacetValue
						metadataItem={props.metadataItem}
					/>
				</>
			}
		</Wrapper>
	)
}

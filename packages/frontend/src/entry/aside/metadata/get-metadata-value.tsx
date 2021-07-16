import React from 'react'
import { MetadataItem, DEFAULT_SPACING, StringMetadata } from '@docere/common'
import styled from 'styled-components'
import { isListMetadataItem, isBooleanMetadataItem, isDateMetadataItem, isHierarchyMetadataItem, isRangeMetadataItem } from '../../../../../search/src'

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
export function MetadataItemComp(props: Props) {
	return (
		<Wrapper>
			{
				isListMetadataItem(props.metadataItem) &&
				<StringMetadata
					metadataId={props.metadataItem.config.id}
					value={props.metadataItem.value}

				/>
			}
			{
				isHierarchyMetadataItem(props.metadataItem) &&
				<>
					<Title>{props.metadataItem.config.title}</Title>
					<HierarchyFacetValue
						metadataItem={props.metadataItem}
					/>
				</>
			}
			{
				isBooleanMetadataItem(props.metadataItem) &&
				<>
					<Title>{props.metadataItem.config.title}</Title>
					<BooleanFacetValue
						metadataItem={props.metadataItem}
					/>
				</>
			}
			{
				(isRangeMetadataItem(props.metadataItem) || isDateMetadataItem(props.metadataItem)) &&
				<>
					<Title>{props.metadataItem.config.title}</Title>
					<DateFacetValue
						metadataItem={props.metadataItem}
					/>
				</>
			}
		</Wrapper>
	)
}

import React from 'react'
import { MetadataItem, DEFAULT_SPACING } from '@docere/common'
import styled from 'styled-components'
import { isListFacetConfig, isHierarchyFacetConfig, isBooleanFacetConfig, isRangeFacetConfig, isDateFacetConfig } from '@docere/search_'

import ListFacetValue from './list-value'
import HierarchyFacetValue from './hierarchy-value'
import BooleanFacetValue from './boolean-value'
import RangeFacetValue from './range-value'

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
export default function MetadataItem(props: Props) {
	return (
		<Wrapper>
			<Title>{props.metadataItem.title}</Title>
			{
				isListFacetConfig(props.metadataItem) &&
				<ListFacetValue
					metadataItem={props.metadataItem}
				/>
			}
			{
				isHierarchyFacetConfig(props.metadataItem) &&
				<HierarchyFacetValue
					metadataItem={props.metadataItem}
				/>
			}
			{
				isBooleanFacetConfig(props.metadataItem) &&
				<BooleanFacetValue
					metadataItem={props.metadataItem}
				/>
			}
			{
				isRangeFacetConfig(props.metadataItem) &&
				<RangeFacetValue
					metadataItem={props.metadataItem}
				/>
			}
		</Wrapper>
	)
}

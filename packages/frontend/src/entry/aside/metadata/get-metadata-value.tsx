import React from 'react'
import { MetadataItem, DEFAULT_SPACING, StringMetadata, isPartialStandoff, StandoffTree3, useComponents, ContainerType, AsideTab, PartialStandoff } from '@docere/common'
import styled from 'styled-components'
import { isListMetadataItem, isBooleanMetadataItem, isDateMetadataItem, isHierarchyMetadataItem, isRangeMetadataItem } from '@docere/common'

// import ListFacetValue from './list-facet'
import HierarchyFacetValue from './hierarchy-value'
import BooleanFacetValue from './boolean-value'
// import RangeFacetValue from './range-value'
import DateFacetValue from './date-facet'
import { DocereTextView } from '@docere/text'

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
				isPartialStandoff(props.metadataItem.value) &&
				<TextMetadata {...props} />
			}
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


const StandoffMetadataWrapper = styled.div`
	font-size: .8rem;
`

function TextMetadata(props: Props) {
	const components = useComponents(ContainerType.Aside, AsideTab.Metadata)

	return (
		<StandoffMetadataWrapper>
			<Title>{props.metadataItem.config.title}</Title>
			<DocereTextView
				components={components}
				standoffTree={new StandoffTree3(props.metadataItem.value as unknown as PartialStandoff)}
			/>
		</StandoffMetadataWrapper>
	)
}

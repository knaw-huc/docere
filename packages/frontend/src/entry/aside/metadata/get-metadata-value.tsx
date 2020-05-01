import React from 'react'
import { MetadataItem, DEFAULT_SPACING } from '@docere/common'
import styled from 'styled-components'
import MetadataValue from './value'

// function isTopLevelHierarchyFacetConfig(config: MetadataConfig) {
// 	console.log(config.id, /0$/.test(config.id))
// 	return (config.datatype === EsDataType.Hierarchy && /0$/.test(config.id))
// }

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
			<MetadataValue
				facetId={props.metadataItem.id}
				value={props.metadataItem.value}
			/>
		</Wrapper>
	)

	// if (isHierarchyFacetConfig(config)) return hierarchyValue()
	// 	if (!isTopLevelHierarchyFacetConfig(config)) return null


	// }

	// if (!config.showInAside) return null
	// if (!config.showAsFacet) return value

	// metadataConfig
	// return (
	// 	<MetadataValue
	// 		facetId={config.id}
	// 		value={value}
	// 	/>
	// )
}

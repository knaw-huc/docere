import React from 'react'
import { EntityConfig, MetadataConfig } from '../..'

import { SearchContext } from '../../..'
import { ProjectContext } from '../../../project/context'
import { MetadataWrapper } from '../wrapper'
import Value from './value'

interface Props {
	metadataId: string
	value: string | string[]
}
export function StringMetadata(props: Props) {
	const { config: projectConfig } = React.useContext(ProjectContext)

	const configs = new Map<string, MetadataConfig | EntityConfig>()
	for (const md of projectConfig.metadata2) configs.set(md.id, md)
	for (const en of projectConfig.entities2) configs.set(en.id, en)
	const config = configs.get(props.metadataId)
	if (config == null) return null

	const searchContext = React.useContext(SearchContext)
	const facet = searchContext.state.facets.get(props.metadataId)

	return (
		<MetadataWrapper title={config.title}>
			{
				(
					props.value == null ||
					props.value.length === 0
				) ?
					'-' :
					Array.isArray(props.value) ?
						props.value.map(v =>
							<Value
								facet={facet}
								id={props.metadataId}
								key={`${props.metadataId}${v}`}
								value={v}
							/>
						) :
						<Value
							facet={facet}
							id={props.metadataId}
							value={props.value}
						/>
			}
		</MetadataWrapper>
	)
}

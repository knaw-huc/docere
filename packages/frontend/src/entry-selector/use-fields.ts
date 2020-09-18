import * as React from 'react'
import { fetchJson, EsDataType, defaultMetadata } from '@docere/common'

import type { DocereConfig, FacetsConfig, MetadataConfig, EntityConfig } from '@docere/common'

const ignoreKeys = ['text', 'text_suggest', 'facsimiles', 'id']

function filterNonFacets(field: MetadataConfig) {
	// Do not show facets if config says so
	if (!field.showAsFacet) return false

	// Do not show seperate levels of hierarchy facet
	if (/level\d+/.test(field.id)) return false

	// Do not show facets which datatype cannot be visualised
	if (field.datatype === EsDataType.Null || field.datatype === EsDataType.Text) return false

	return true
}

function sortByOrder(f1: MetadataConfig, f2: MetadataConfig) {
	return f1.order - f2.order
}

function mapToFacetConfig(config: DocereConfig) {
	// Create a map, because a look up is much faster than a [].find
	const metadataById = [...config.metadata, ...config.entities]
		.reduce((prev, curr) => {
			prev[curr.id] = curr
			return prev
		}, {} as Record<string, MetadataConfig | EntityConfig>)

	return function (key: string) { 
		if (metadataById.hasOwnProperty(key)) return metadataById[key]

		// If facet is not defined in the config, create a default facet config
		return {
			...defaultMetadata,
			id: key,
			title: key.charAt(0).toUpperCase() + key.slice(1)
		}
	}
}

export default function useFacetsConfig(config: DocereConfig) {
	const [fields, setFields] = React.useState<FacetsConfig>({})

	React.useEffect(() => {
		// TODO extract url from projectContext.searchUrl
		fetchJson(`/search/${config.slug}/_mapping`)
			.then(json => {
				const { properties } = json[config.slug].mappings

				const tmpFields = Object.keys(properties)
					.filter(key => ignoreKeys.indexOf(key) === -1)
					.map(mapToFacetConfig(config))
					.filter(filterNonFacets)
					.sort(sortByOrder)
					.reduce((prev, curr) => {
						prev[curr.id] = curr
						return prev
					}, {} as FacetsConfig)

				setFields(tmpFields)
			})
			.catch(err => console.log(err))
	}, [config.slug])
	
	return fields
}

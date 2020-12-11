import React from 'react'
import { EsDataType, ProjectContext } from '@docere/common'

import type { FacetsConfig, MetadataConfig } from '@docere/common'

function filterNonFacets(field: MetadataConfig) {
	// Do not show facets if config says so
	if (!field.showAsFacet) return false

	// Do not show facets which datatype cannot be visualised
	if (field.datatype === EsDataType.Null || field.datatype === EsDataType.Text) return false

	return true
}

function sortByOrder(f1: MetadataConfig, f2: MetadataConfig) {
	return f1.order - f2.order
}

export default function useFacetsConfig() {
	const { config } = React.useContext(ProjectContext)
	const [fields, setFields] = React.useState<FacetsConfig>({})

	React.useEffect(() => {
		const facetsConfig = [...config.metadata, ...config.entities]
			.filter(filterNonFacets)
			.sort(sortByOrder)
			.reduce((prev, curr) => {
				prev[curr.id] = curr
				return prev
			}, {} as FacetsConfig)

		setFields(facetsConfig)
	}, [config.slug])
	
	return fields
}

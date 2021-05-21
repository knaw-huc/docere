import React from 'react'
import { EsDataType, ProjectContext } from '@docere/common'

import type { FacetsConfig, MetadataConfig } from '@docere/common'

function filterNonFacets(field: MetadataConfig) {
	// Do not show facet if there is not facet config
	if (field.facet == null) return false

	// Do not show facets which datatype cannot be visualised
	if (field.facet.datatype === EsDataType.Null || field.facet.datatype === EsDataType.Text) return false

	return true
}

function sortByOrder(f1: MetadataConfig, f2: MetadataConfig) {
	return f1.facet.order - f2.facet.order
}

export default function useFacetsConfig() {
	const { config } = React.useContext(ProjectContext)
	const [fields, setFields] = React.useState<FacetsConfig>({})

	React.useEffect(() => {
		const facetsConfig = [...config.metadata2, ...config.entities2]
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

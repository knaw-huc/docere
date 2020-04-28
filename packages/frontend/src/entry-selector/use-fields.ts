import * as React from 'react'
import { EsDataType, defaultMetadata, FacetsConfig } from '@docere/common'

import { fetchJson } from '../utils'
import { searchBaseUrl } from './search'

import type { DocereConfig } from '@docere/common'

const ignoreKeys = ['text', 'text_suggest', 'facsimiles', 'id']

export default function useFacetsConfig(config: DocereConfig) {
	const [fields, setFields] = React.useState<FacetsConfig>({})

	React.useEffect(() => {
		fetchJson(`${searchBaseUrl}${config.slug}/_mapping`)
			.then(json => {
				const { properties } = json[config.slug].mappings

				const tmpFields = Object.keys(properties)
					.filter(key => ignoreKeys.indexOf(key) === -1)
					.map(key => {
						let mdConfig = config.metadata.find(md => md.id === key)
						if (mdConfig == null) mdConfig = config.entities.find(td => td.id === key)
						if (mdConfig == null) mdConfig = {
							...defaultMetadata,
							id: key,
							title: key.charAt(0).toUpperCase() + key.slice(1)
						}
						return mdConfig
					})
					.filter(field => field.showAsFacet && field.datatype !== EsDataType.Null && field.datatype !== EsDataType.Text )
					.sort((f1, f2) => f1.order - f2.order)

				setFields(
					tmpFields.reduce((prev, curr) => {
						prev[curr.id] = curr
						return prev
					}, {} as FacetsConfig)
				)
			})
			.catch(err => console.log(err))
	}, [config.slug])
	
	return fields
}

import { LayerType, EsDataType } from '@docere/common'

import type { DocereConfig } from '@docere/common'
import extractFacsimiles from './facsimiles'

const config: DocereConfig = {
	slug: 'republic',
	title: 'Republic',
	collection: {
		metadataId: 'order',
		sortBy: 'order',
	},
	metadata: [
		{
			datatype: EsDataType.Integer,
			extract: entry => {
				const num = /\d+$/.exec(entry.id.replace(/\.jpg\.page$/, ''))
				return parseInt(num[0], 10)
			},
			id: 'order',
			range: 1000,
			showAsFacet: false,
		}	
	],
	entities: [],
	facsimiles: {
		extract: extractFacsimiles,
	},
	layers: [
		{
			id: 'scan',
			type: LayerType.Facsimile
		},
		{
			id: 'text',
			type: LayerType.Text
		},
	]
}

export default config

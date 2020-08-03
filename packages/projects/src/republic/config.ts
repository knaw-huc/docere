import { LayerType, EsDataType } from '@docere/common'

import type { DocereConfig } from '@docere/common'

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
			id: 'order',
			range: 1000,
			showAsFacet: false,
		}	
	],
	entities: [],
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

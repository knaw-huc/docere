import { LayerType, EsDataType } from '@docere/common'

import type { DocereConfig } from '@docere/common'
import extractFacsimiles from './facsimiles'

const config: DocereConfig = {
	slug: 'republic',
	title: 'Republic',
	collection: {
		metadataId: 'date',
		sortBy: 'date',
	},
	metadata: [
		{
			datatype: EsDataType.Date,
			extract: entry =>
				entry.document.querySelector('meta[key="meeting_date"]')?.getAttribute('value'),
			id: 'date',
			interval: 'y'
		},
		{
			extract: entry =>
				entry.document.querySelector('meta[key="inventory_num"]')?.getAttribute('value'),
			id: 'inventory_num',
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

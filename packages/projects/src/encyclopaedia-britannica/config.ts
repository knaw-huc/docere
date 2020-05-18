import { LayerType, EsDataType } from '@docere/common'
import { DocereConfig } from '@docere/common'
import sets from './data/sets.json'

const config: DocereConfig = {
	collection: {
		metadataId: 'setId',
		sortBy: null
	},
	data: { sets },
	slug: 'encyclopaedia-britannica',
	title: 'Encyclopaedia Britannica',
	layers: [
		{ id: 'scan', type: LayerType.Facsimile, active: false },
		{ id: 'prepared', active: false },
		{ id: 'alto' },
	],
	metadata: [
		{
			id: 'access',
			levels: 3,
			order: 10,
			title: 'Editions',
			datatype: EsDataType.Hierarchy,
		},
		{
			id: 'setId',
			showAsFacet: false,
		},
	]
}

export default config

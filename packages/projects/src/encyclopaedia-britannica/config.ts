import { LayerType, EsDataType } from '@docere/common'
import { DocereConfig } from '@docere/common'
import sets from './data/sets.json'

const config: DocereConfig = {
	collection: {
		metadataId: 'access',
		sortBy: null
	},
	data: { sets },
	slug: 'encyclopaedia-britannica',
	title: 'Encyclopaedia Britannica',
	layers: [
		{ id: 'scan', type: LayerType.Facsimile },
		{ id: 'prepared' },
		{ id: 'alto', active: false },
	],
	metadata: [
		{
			id: 'access',
			levels: 3,
			order: 10,
			title: 'Editions',
			datatype: EsDataType.Hierarchy
		},
		// {
		// 	id: 'access_level1',
		// 	showAsFacet: false,
		// },
		// {
		// 	id: 'access_level2',
		// 	showAsFacet: false,
		// },
		{
			id: 'setId',
			showAsFacet: false,
		},
	]
}

export default config

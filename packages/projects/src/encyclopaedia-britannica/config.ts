import { LayerType, EsDataType, TextLayer } from '@docere/common'
import { DocereConfig } from '@docere/common'
import sets from './data/sets.json'
import extractPreparedLayer from './layers'

const config: DocereConfig = {
	collection: {
		metadataId: 'setId',
		sortBy: null
	},
	data: { sets },
	slug: 'encyclopaedia-britannica',
	title: 'Encyclopaedia Britannica',
	entities: [
		{
			extract: entry => Array.from((entry.layers.find(l => l.id === 'alto') as TextLayer).element.querySelectorAll('String[CONTENT][ID]'))
				.map((el: Element) => ({
					element: el,
					id: el.getAttribute('ID'),
					value: el.getAttribute('VALUE'),
				})),
			id: 'string',
			revealOnHover: true,
			textLayers: ['alto'],
		}
	],
	layers: [
		{
			id: 'scan',
			type: LayerType.Facsimile,
			active: false
		},
		{
			active: false,
			extract: extractPreparedLayer,
			id: 'prepared',
			type: LayerType.Text,
		},
		{
			id: 'alto',
			type: LayerType.Text,
		},
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

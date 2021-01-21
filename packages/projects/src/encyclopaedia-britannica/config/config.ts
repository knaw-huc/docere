import { LayerType, EsDataType } from '@docere/common'
import { DocereConfig } from '@docere/common'
import sets from '../data/sets.json'
import extractPreparedLayer from './layers'
import extractFacsimiles from './facsimiles'
import plainText from './text'

const projectId = 'encyclopaedia-britannica'

const config: DocereConfig = {
	collection: {
		metadataId: 'setId',
		sortBy: null
	},
	data: { sets },
	slug: projectId,
	title: 'Encyclopaedia Britannica',
	entities: [
		{
			extract: ({ layerElement, entityConfig }) => Array.from(layerElement.querySelectorAll(entityConfig.selector))
				.map((el: Element) => ({
					anchor: el,
					element: el,
					content: el.getAttribute('VALUE'),
				})),
			extractId: el => el.getAttribute('ID'),
			id: 'string',
			revealOnHover: true,
			selector: 'String[CONTENT][ID]',
		}
	],
	facsimiles: {
		extractFacsimileId: el => el.id, /* TODO fix */
		extractFacsimiles,
		selector: 'FIXME',
	},
	layers: [
		{
			id: 'scan',
			type: LayerType.Facsimile,
			active: false
		},
		{
			active: false,
			extractElement: extractPreparedLayer,
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
			extract: (entry, config) => {
				const [setId] = entry.id.split('/alto/')
				const set = config.data.sets.find((s: any) => s.setId === setId)
				return Object.keys(set)
					.filter(key => key.slice(0, 7) === 'access_')
					.map(key => set[key])
			},
			id: 'access',
			levels: 3,
			order: 10,
			title: 'Editions',
			datatype: EsDataType.Hierarchy,
		},
		{
			extract: entry => entry.id.split('/alto/')[1],
			id: 'n',
			showAsFacet: false,
		},
		{
			extract: entry => entry.id.split('/alto/')[0],
			id: 'setId',
			showAsFacet: false,
		},
	],
	plainText,
}

export default config

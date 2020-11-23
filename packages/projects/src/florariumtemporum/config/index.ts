import { extendConfigData, LayerType, Colors, EntityType } from '@docere/common'
import extractFacsimiles from './facsimiles'
import prepare from './prepare'

export default extendConfigData({
	collection: {
		metadataId: 'n',
		sortBy: 'n',
	},
	entities: [
		{
			color: Colors.BlueBright,
			id: 'note',
			extract: ({ layerElement, entityConfig }) => Array.from(layerElement.querySelectorAll(entityConfig.selector))
				.map(el => ({
					anchors: [el],
					content: el.outerHTML,
					n: el.getAttribute('xml:id').slice(1),
					title: `Note ${el.getAttribute('xml:id').slice(1)}`,
				})),
			extractId: el => el.getAttribute('xml:id'),
			selector: 'note',
			title: "Notes",
			type: EntityType.Note,
		},
	],
	facsimiles: {
		extractFacsimileId: el => el.getAttribute('path'),
		extractFacsimiles,
		selector: 'pb[path]',
	},
	layers: [
		{
			active: true,
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			id: 'text',
			type: LayerType.Text,
		},
	],
	metadata: [
		{
			id: 'n',
			extract: entry => entry.preparedElement.querySelector('text > body > div').getAttribute('xml:id')
		}
	],
	prepare,
	private: true,
	slug: 'florariumtemporum',
	title: "Florarium temporum",
})

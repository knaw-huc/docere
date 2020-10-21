import { extendConfigData, LayerType, Colors, EntityType } from '@docere/common'
import extractFacsimiles from './facsimiles'
import prepare from './prepare'

export default extendConfigData({
	collection: {
		metadataId: 'n',
		sortBy: 'n',
	},
	slug: 'florariumtemporum',
	title: "Florarium temporum",
	private: true,
	facsimiles: {
		extract: extractFacsimiles,
	},
	metadata: [
		{
			id: 'n',
			extract: entry => entry.element.querySelector('text > body > div').getAttribute('xml:id')
		}
	],
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
	entities: [
		{
			color: Colors.BlueBright,
			id: 'note',
			extract: entry => Array.from(entry.document.querySelectorAll('note'))
				.map(el => ({
					content: el.outerHTML,
					id: el.getAttribute('xml:id'),
					n: el.getAttribute('xml:id').slice(1),
					title: `Note ${el.getAttribute('xml:id').slice(1)}`,
				})),
			title: "Notes",
			type: EntityType.Note,
		},
	],
	prepare,
})

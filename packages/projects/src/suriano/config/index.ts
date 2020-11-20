import { extendConfigData, LayerType, Colors, EntityType } from '@docere/common'
import { extractEntryPartElementsFromMilestone } from '../../utils'
import extractFacsimiles from './facsimiles'
import prepare from './prepare'

// function filterFacsimiles(entry: ConfigEntry) {
// 	const facsimileIds = Array.from(entry.element.querySelectorAll('pb')).map(pb => pb.id)
// 	return (facsimile: Facsimile) => facsimileIds.indexOf(facsimile.id) > -1
// }

export default extendConfigData({
	collection: {
		metadataId: 'parent',
		sortBy: 'n',
	},
	slug: 'suriano',
	title: "Suriano",
	private: true,
	metadata: [
		{
			id: 'parent',
			extract: entry => entry.parent?.id
		},
		{
			id: 'n',
			extract: entry => {
				const result = /\d+$/.exec(entry.id)
				if (!Array.isArray(result) || result.length === 0) return null
				const n = result[0]
				return n != null && n.length ?
					parseInt(n, 10) :
					null
			},
		}
	],
	layers: [
		{
			active: true,
			// filterEntities: () => () => false,
			// filterFacsimiles,
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			extractFacsimiles,
			id: 'text',
			type: LayerType.Text,
			// filterFacsimiles,
			// filterEntities: entry => {
			// 	const noteIds = Array.from(entry.element.querySelectorAll('a.footnote-ref'))
			// 		.map(a => a.getAttribute('href').slice(1))
			// 	return note => noteIds.indexOf(note.id) > -1
			// }
		},
	],
	entities: [
		{
			color: Colors.BlueBright,
			id: 'note',
			extract: layerElement => Array.from(layerElement.querySelectorAll('li[role=doc-endnote]'))
				.map(el => ({
					anchors: [el],
					content: el.outerHTML,
					id: el.id,
					n: el.id.slice(2),
					title: `Note ${el.id.slice(2)}`,
				})),
			title: "Notes",
			type: EntityType.Note,
		},
	],
	parts: {
		extract: extractEntryPartElementsFromMilestone('letterStart'),
	},
	prepare,
})

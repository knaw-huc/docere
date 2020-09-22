import { extendConfigData, LayerType, Colors, Facsimile, ConfigEntry } from '@docere/common'
import { extractEntryPartElementsFromMilestone } from '../../utils'
import extractFacsimiles from './facsimiles'
import prepare from './prepare'

function filterFacsimiles(entry: ConfigEntry) {
	const facsimileIds = Array.from(entry.element.querySelectorAll('pb')).map(pb => pb.id)
	return (facsimile: Facsimile) => facsimileIds.indexOf(facsimile.id) > -1
}

export default extendConfigData({
	slug: 'suriano',
	title: "Suriano",
	private: true,
	facsimiles: {
		extract: extractFacsimiles,
	},
	layers: [
		{
			active: true,
			filterFacsimiles,
			filterNotes: () => () => false,
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			id: 'text',
			type: LayerType.Text,
			filterFacsimiles,
			filterNotes: entry => {
				const noteIds = Array.from(entry.element.querySelectorAll('a.footnote-ref'))
					.map(a => a.getAttribute('href').slice(1))
				return note => noteIds.indexOf(note.id) > -1
			}
		},
	],
	notes: [
		{
			color: Colors.BlueBright,
			id: 'note',
			extract: entry => Array.from(entry.document.querySelectorAll('li[role=doc-endnote]'))
				.map(el => ({
					content: el.outerHTML,
					id: el.id,
					n: el.id.slice(2),
					title: `Note ${el.id.slice(2)}`,
				})),
			title: "Notes",
		},
	],
	parts: {
		extract: extractEntryPartElementsFromMilestone('letterStart'),
	},
	prepare,
})

import { extendConfigData, LayerType, Colors } from '@docere/common'
import { extractEntryPartElementsFromMilestone } from '../../utils'
import extractFacsimiles from './facsimiles'
import prepare from './prepare'

export default extendConfigData({
	slug: 'suriano',
	title: "Suriano",
	private: true,
	layers: [
		{
			active: true,
			extract: extractFacsimiles,
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			id: 'text',
			type: LayerType.Text,
		},
	],
	notes: [
		{
			color: Colors.BlueBright,
			id: 'note',
			extract: entry => Array.from(entry.document.querySelectorAll('li[role=doc-endnote]'))
				.map(el => ({
					id: el.id,
					element: el,
					n: el.id.slice(2),
					title: `Note ${el.id.slice(2)}`,
				})),
			title: "Notes",
		},
	],
	parts: {
		extract: extractEntryPartElementsFromMilestone('letterStart'),
		filterFacsimiles: el => {
			const facsimileIds = Array.from(el.querySelectorAll('pb'))
				.map(pb => pb.id)
			return facsimile => facsimileIds.indexOf(facsimile.id) > -1
		},
		filterNotes: el => {
			const noteIds = Array.from(el.querySelectorAll('a.footnote-ref'))
				.map(a => a.getAttribute('href').slice(1))
			return note => noteIds.indexOf(note.id) > -1
		}
	},
	prepare,
})

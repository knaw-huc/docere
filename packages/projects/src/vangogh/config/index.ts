import { LayerType, EntityType, Colors, extendConfigData, xmlToString } from '@docere/common'
import extractFacsimiles from './facsimiles'
import prepare from './prepare'
import metadata from './metadata'

export default extendConfigData({
	entities: [
		{
			color: Colors.BlueBright,
			// extract: entry => Array.from(entry.document.querySelectorAll('div[type="textualNotes"] > note'))
			extract: (layerElement, _layer, entry) => Array.from(layerElement.querySelectorAll('anchor'))
				.map(anchor => {
					const id = anchor.getAttribute('xml:id')
					const n = anchor.getAttribute('n')
					const note = entry.document.querySelector(`note[target="#${id}"]`)
					if (note == null) return null
					return {
						content: xmlToString(note),
						anchors: [anchor],
						id,
						n,
						title: `Textual note ${n}`,
					}
				})
				.filter(x => x != null),
			id: 'textual',
			title: "Textual notes",
			type: EntityType.Note,
		},
		{
			color: Colors.BlueBright,
			// TODO querySelectorAll the anchors (lb)
			extract: (layerElement) => Array.from(layerElement.querySelectorAll('div[type="notes"] > note'))
				.map(el => {
					return {
						anchors: [el],
						content: xmlToString(el),
						id: el.getAttribute('xml:id'),
						n: el.getAttribute('n'),
						title: `Editor note ${el.getAttribute('n')}`,
					}
				}),
			id: 'editor',
			title: "Editor notes",
			type: EntityType.Note,
		},
		{
			color: '#fd7a7a',
			extract: (layerElement) => Array.from(layerElement.querySelectorAll('rs[type="pers"]'))
				.map(el => ({
					content: el.textContent,
					anchors: [el],
					id: el.getAttribute('key'),
				})),
			id: 'pers',
			showInAside: true,
			title: 'Persons',
			type: EntityType.Person,
		},
		{
			color: Colors.Orange,
			extract: (layerElement) => Array.from(layerElement.querySelectorAll('ref[target][type="entry-link"]'))
				.map(el => ({
					anchors: [el],
					content: el.textContent,
					id: el.getAttribute('target').replace(/\.xml$/, ''),
				})),
			id: 'entry-link',
			type: EntityType.EntryLink,
		},
		{
			color: Colors.Brown,
			extract: (layerElement) => Array.from(layerElement.querySelectorAll('ref[target][type="note-link"]'))
				.map(el => ({
					anchors: [el],
					content: el.textContent,
					id: el.getAttribute('target'),
				})),
			id: 'note-link',
			type: EntityType.NoteLink,
		},
	],
	facsimiles: {
		extractFacsimiles,
		extractFacsimileId: el => el.getAttribute('xml:id'),
		selector: 'facsimile zone',
	},
	layers: [
		{
			active: true,
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			active: false,
			extractElement: entry => entry.document.querySelector('div[type="original"]'),
			id: 'original',
			type: LayerType.Text,
		},
		{
			active: true,
			extractElement: entry => entry.document.querySelector('div[type="translation"]'),
			id: 'translation',
			type: LayerType.Text,
		},
	],
	metadata,
	slug: 'vangogh',
	title: 'Van Gogh Letters',
	pages: [],
	prepare,
})

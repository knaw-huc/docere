import { LayerType, EntityType, Colors, extendConfigData, xmlToString } from '@docere/common'
import extractFacsimiles from './facsimiles'
import prepare from './prepare'
import metadata from './metadata'

export default extendConfigData({
	slug: 'vangogh',
	title: 'Van Gogh Letters',
	metadata,
	pages: [],
	entities: [
		{
			color: Colors.BlueBright,
			// extract: entry => Array.from(entry.document.querySelectorAll('div[type="textualNotes"] > note'))
			extract: entry => Array.from(entry.document.querySelectorAll('anchor'))
				.map(anchor => {
					const id = anchor.getAttribute('xml:id')
					const n = anchor.getAttribute('n')
					const note = entry.document.querySelector(`note[target="#${id}"]`)
					if (note == null) return null
					return {
						content: xmlToString(note),
						el: anchor,
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
			extract: entry => Array.from(entry.document.querySelectorAll('div[type="notes"] > note'))
				.map(el => {
					return {
						content: xmlToString(el),
						el,
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
			extract: entry => Array.from(entry.document.querySelectorAll('div[type="translation"] rs[type="pers"]'))
				.map(el => ({
					content: el.textContent,
					el,
					id: el.getAttribute('key'),
				})),
			id: 'pers',
			showInAside: true,
			title: 'Persons',
			type: EntityType.Person,
		},
		{
			color: Colors.Orange,
			extract: entry => Array.from(entry.document.querySelectorAll('ref[target][type="entry-link"]'))
				.map(el => ({
					content: el.textContent,
					el,
					id: el.getAttribute('target').replace(/\.xml$/, ''),
				})),
			id: 'entry-link',
			type: EntityType.EntryLink,
		},
		{
			color: Colors.Brown,
			extract: entry => Array.from(entry.document.querySelectorAll('ref[target][type="note-link"]'))
				.map(el => ({
					content: el.textContent,
					el,
					id: el.getAttribute('target'),
				})),
			id: 'note-link',
			type: EntityType.NoteLink,
		},
	],
	facsimiles: {
		extract: extractFacsimiles,
	},
	layers: [
		{
			active: true,
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			active: false,
			extract: entry => entry.document.querySelector('div[type="original"]'),
			id: 'original',
			type: LayerType.Text,
		},
		{
			active: true,
			extract: entry => entry.document.querySelector('div[type="translation"]'),
			id: 'translation',
			type: LayerType.Text,
		},
	],
	prepare,
})

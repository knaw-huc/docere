import { LayerType, EntityType, Colors, extendConfigData } from '@docere/common'
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
			id: 'textual',
			extract: entry => Array.from(entry.document.querySelectorAll('div[type="textualNotes"] > note'))
				.map(el => ({
					content: el.outerHTML,
					id: el.getAttribute('xml:id'),
					n: el.getAttribute('n'),
					title: `Note ${el.getAttribute('n')}`,
				})),
			title: "Textual notes",
			type: EntityType.Note,
		},
		{
			color: Colors.BlueBright,
			id: 'editor',
			extract: entry => Array.from(entry.document.querySelectorAll('div[type="notes"] > note'))
				.map(el => ({
					content: el.outerHTML,
					id: el.getAttribute('xml:id'),
					n: el.getAttribute('n'),
					title: `Note ${el.getAttribute('n')}`,
				})),
			title: "Editor notes",
			type: EntityType.Note,
		},
		{
			color: '#fd7a7a',
			extract: entry => Array.from(entry.document.querySelectorAll('div[type="translation"] rs[type="pers"]'))
				.map(el => ({
					id: el.getAttribute('key'),
					content: el.textContent
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
					id: el.getAttribute('target').replace(/\.xml$/, ''),
					content: el.textContent,
				})),
			id: 'entry-link',
			type: EntityType.EntryLink,
		},
		{
			color: Colors.Brown,
			extract: entry => Array.from(entry.document.querySelectorAll('ref[target][type="note-link"]'))
				.map(el => ({
					id: el.getAttribute('target'),
					content: el.textContent,
				})),
			id: 'note-link',
			type: EntityType.NoteLink,
		},
		// {
		// 	id: 'lb',
		// 	type: RsType.Line
		// }
	],
	facsimiles: {
		extract: extractFacsimiles,
	},
	layers: [
		{
			active: true,
			// filterFacsimiles: () => () => true,
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

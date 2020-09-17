import { LayerType, RsType, Colors } from '@docere/common'
import type { DocereConfig } from '@docere/common'
import extractFacsimiles from './facsimiles'
import prepare from './prepare'
import metadata from './metadata'

const config: DocereConfig = {
	slug: 'vangogh',
	title: 'Van Gogh Letters',
	metadata,
	notes: [
		{
			color: Colors.BlueBright,
			id: 'textual',
			extract: entry => Array.from(entry.document.querySelectorAll('div[type="textualNotes"] > note'))
				.map(el => ({
					id: el.getAttribute('xml:id'),
					element: el,
					n: el.getAttribute('n'),
					title: `Note ${el.getAttribute('n')}`,
				})),
			title: "Textual notes",
		},
		{
			color: Colors.BlueBright,
			id: 'editor',
			extract: entry => Array.from(entry.document.querySelectorAll('div[type="notes"] > note'))
				.map(el => ({
					id: el.getAttribute('xml:id'),
					element: el,
					n: el.getAttribute('n'),
					title: `Note ${el.getAttribute('n')}`,
				})),
			title: "Editor notes",
		},
	],
	pages: [],
	entities: [
		{
			color: '#fd7a7a',
			extract: entry => Array.from(entry.document.querySelectorAll('div[type="translation"] rs[type="pers"]'))
				.map(el => ({
					id: el.getAttribute('key'),
					value: el.textContent
				})),
			id: 'pers',
			showInAside: true,
			textLayers: ['translation'],
			title: 'Persons',
			type: RsType.Person,
		},
		{
			color: Colors.Orange,
			extract: entry => Array.from(entry.document.querySelectorAll('ref[target][type="entry-link"]'))
				.map(el => ({
					id: el.getAttribute('target').replace(/\.xml$/, ''),
					value: el.textContent,
				})),
			id: 'entry-link',
			type: RsType.EntryLink,
		},
		{
			color: Colors.Brown,
			extract: entry => Array.from(entry.document.querySelectorAll('ref[target][type="note-link"]'))
				.map(el => ({
					id: el.getAttribute('target'),
					value: el.textContent,
				})),
			id: 'note-link',
			type: RsType.NoteLink,
		},
		// {
		// 	id: 'lb',
		// 	type: RsType.Line
		// }
	],
	layers: [
		{
			active: true,
			extract: extractFacsimiles,
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			active: false,
			extract: entry => entry.document.querySelector('div[type="original"]'),
			id: 'original',
			type: LayerType.Text,
			// selector: 'div[type="original"]',
		},
		{
			active: true,
			extract: entry => entry.document.querySelector('div[type="translation"]'),
			id: 'translation',
			type: LayerType.Text,
		},
	],
	prepare,
}

export default config

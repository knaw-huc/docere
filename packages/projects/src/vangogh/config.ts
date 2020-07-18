import { EsDataType, LayerType, RsType, Colors } from '@docere/common'
import type { DocereConfig } from '@docere/common'

const config: DocereConfig = {
	slug: 'vangogh',
	title: 'Van Gogh Letters',
	metadata: [
		{
			id: 'author',
			order: 100,
		},
		{
			id: 'addressee',
			order: 200,
		},
		{
			id: 'date',
			order: 300,
			showAsFacet: false
		},
		{
			id: 'placelet',
			title: 'Place',
		},
		{
			id: 'letcontents',
			datatype: EsDataType.Text,
			title: 'Summary',
		},
		{
			id: 'has_figure',
			datatype: EsDataType.Boolean,
			title: 'Has figure'
		},
		{
			id: 'pers',
			title: 'Person',
		},
		{
			id: 'datelet',
			title: 'Date',
		},
		{
			id: 'sourcestatus',
			title: 'Status',
		},
		{
			id: 'location',
			title: 'Current location',
		}
	],
	notes: [
		{
			color: Colors.BlueBright,
			id: 'textual',
			extract: doc => Array.from(doc.querySelectorAll('div[type="textualNotes"] > note'))
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
			extract: doc => Array.from(doc.querySelectorAll('div[type="notes"] > note'))
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
			extract: doc => Array.from(doc.querySelectorAll('div[type="translation"] rs[type="pers"]'))
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
			extract: doc => Array.from(doc.querySelectorAll('ref[target][type="entry-link"]'))
				.map(el => ({
					id: el.getAttribute('target').replace(/\.xml$/, ''),
					value: el.textContent,
				})),
			id: 'entry-link',
			type: RsType.EntryLink,
		},
		{
			color: Colors.Brown,
			extract: doc => Array.from(doc.querySelectorAll('ref[target][type="note-link"]'))
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
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			active: false,
			id: 'original',
			type: LayerType.Text,
			// selector: 'div[type="original"]',
			extract: doc => doc.querySelector('div[type="original"]'),
		},
		// {
		// 	active: false,
		// 	id: 'original-tei',
		// 	title: 'Original TEI',
		// 	type: LayerType.XML,
		// 	// selector: 'div[type="original"]',
		// },
		{
			active: true,
			extract: doc => doc.querySelector('div[type="translation"]'),
			id: 'translation',
			type: LayerType.Text,
			// selector: 'div[type="translation"]',
		},
		// {
		// 	active: false,
		// 	id: 'translation-tei',
		// 	title: 'Translation TEI',
		// 	type: LayerType.XML,
		// 	// selector: 'div[type="translation"]',
		// },
		// {
		// 	active: false,
		// 	id: 'tei',
		// 	title: 'Full TEI',
		// 	type: LayerType.XML,
		// },
	]
}

export default config

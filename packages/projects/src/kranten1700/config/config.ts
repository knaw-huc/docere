import { EsDataType, LayerType, Colors } from '@docere/common'
import { DocereConfig } from '@docere/common'
import { extractLayerElement } from '../../utils'
import prepare from './prepare'

const config: DocereConfig = {
	slug: 'kranten1700',
	title: 'Kranten 1700',
	metadata: [
		{
			datatype: EsDataType.Date,
			extract: entry => entry.document.querySelector('meta[id="date"]').textContent,
			id: 'date',
			interval: 'y',
			order: 0,
		},
		// {
		// 	id: 'pos',
		// 	size: 12,
		// 	title: 'PoS tagging',
		// },
		{
			extract: entry => entry.document.querySelector('meta[id="article"]').textContent,
			id: "article",
		},
		{
			extract: entry => entry.document.querySelector('meta[id="article_id"]').textContent,
			id: "article_id",
		},
		{
			extract: entry => entry.document.querySelector('meta[id="article_title"]').textContent,
			id: "article_title",
		},
		{
			extract: entry => entry.document.querySelector('meta[id="colophon"]').textContent,
			id: "colophon",
		},
		{
			extract: entry => entry.document.querySelector('meta[id="colophon_text"]').textContent,
			id: "colophon_text",
		},
		{
			extract: entry => entry.document.querySelector('meta[id="err_text_type"]').textContent,
			id: "err_text_type",
		},
		{
			extract: entry => entry.document.querySelector('meta[id="id"]').textContent,
			id: "docId",
		},
		{
			extract: entry => entry.document.querySelector('meta[id="language"]').textContent,
			id: "language",
		},
		{
			extract: entry => entry.document.querySelector('meta[id="paper_id"]').textContent,
			id: "paper_id",
		},
		{
			extract: entry => entry.document.querySelector('meta[id="paper_title"]').textContent,
			id: "paper_title",
		},
	],
	// notes: [],
	// pages: [],
	entities: [
		{
			color: Colors.Pink,
			extract: entry => Array.from(entry.document.querySelectorAll('w'))
				.map(el  => ({
					id: el.getAttribute('pos'),
					content: el.getAttribute('value'),
				})),
			id: 'pos',
			title: 'Part-of-speech tagging'
		},
		// {
		// 	color: Colors.Green,
		// 	id: 'org',
		// },
		// {
		// 	color: Colors.Orange,
		// 	id: 'per',
		// 	type: RsType.Person,
		// },
		// {
		// 	color: Colors.Blue,
		// 	id: 'loc',
		// 	type: RsType.Location,
		// },
		// {
		// 	color: Colors.BlueLight,
		// 	id: 'misc',
		// },
	],
	layers: [
		{
			active: true,
			extract: extractLayerElement('text'),
			id: 'Origineel',
			type: LayerType.Text,
		},
		// {
		// 	active: true,
		// 	id: 'Contemporain',
		// 	type: LayerType.Text,
		// },
		// {
		// 	active: false,
		// 	id: 'tei',
		// 	title: 'TEI',
		// 	type: LayerType.XML,
		// },
	],
	prepare,
}

export default config

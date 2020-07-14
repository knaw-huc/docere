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
		{ id: 'textual' },
		{ id: 'editor' },
	],
	pages: [],
	entities: [
		{
			color: '#fd7a7a',
			id: 'pers',
			showInAside: true,
			textLayers: ['translation'],
			type: RsType.Person,
		},
		{
			color: Colors.Orange,
			id: 'entry',
			type: RsType.Entry,
		}
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

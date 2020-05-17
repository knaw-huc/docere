import { EsDataType, LayerType, RsType, TextDataExtractionType } from '@docere/common'
import type { DocereConfig } from '@docere/common'

const config: DocereConfig = {
	slug: 'vangogh',
	title: 'Van Gogh Letters',
	metadata: [
		{
			id: 'author',
		},
		{
			id: 'addressee',
		},
		{
			id: 'placelet',
		},
		{
			id: 'letcontents',
			datatype: EsDataType.Text,
		},
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
			identifier: {
				type: TextDataExtractionType.Attribute,
				attribute: 'key'
			},
			textLayers: ['translation'],
			type: RsType.Person
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

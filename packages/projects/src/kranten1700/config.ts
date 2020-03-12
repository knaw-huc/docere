import { EsDataType, TextDataExtractionType, LayerType, Colors } from '@docere/common'

const config: DocereConfig = {
	slug: 'kranten1700',
	title: 'Kranten 1700',
	metadata: [
		{
			datatype: EsDataType.Date,
			id: 'date',
			order: 0,
		},
		{
			id: 'pos',
			size: 12,
			title: 'PoS tagging',
		}
	],
	notes: [],
	pages: [],
	entities: [
		{
			color: Colors.Pink,
			id: 'pos',
			identifier: {
				type: TextDataExtractionType.Attribute,
				attribute: 'pos'
			},
			title: 'Part-of-speech tagging'
		},
		{
			color: Colors.Green,
			id: 'org',
			identifier: {
				type: TextDataExtractionType.TextContent
			},
		},
		{
			color: Colors.Orange,
			id: 'per',
			identifier: {
				type: TextDataExtractionType.TextContent
			},
		},
		{
			color: Colors.Blue,
			id: 'loc',
			identifier: {
				type: TextDataExtractionType.TextContent
			},
		},
		{
			color: Colors.BlueLight,
			id: 'misc',
			identifier: {
				type: TextDataExtractionType.TextContent
			},
		},
	],
	layers: [
		{
			active: true,
			id: 'Origineel',
			type: LayerType.Text,
		},
		{
			active: true,
			id: 'Contemporain',
			type: LayerType.Text,
		},
		{
			active: false,
			id: 'tei',
			title: 'TEI',
			type: LayerType.XML,
		},
	]
}

export default config

import { EsDataType, LayerType, Colors, ExtractedTextData } from '@docere/common'
import { DocereConfig } from '@docere/common'

const config: DocereConfig = {
	slug: 'kranten1700',
	title: 'Kranten 1700',
	metadata: [
		{
			datatype: EsDataType.Date,
			id: 'date',
			interval: 'y',
			order: 0,
		},
		{
			id: 'pos',
			size: 12,
			title: 'PoS tagging',
		}
	],
	// notes: [],
	// pages: [],
	entities: [
		{
			color: Colors.Pink,
			extract: doc => Array.from(doc.querySelectorAll('w'))
				.map((el): ExtractedTextData => ({
					id: el.getAttribute('pos'),
					value: el.getAttribute('pos'),
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
			extract: doc => doc.querySelector('text'),
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
	]
}

export default config

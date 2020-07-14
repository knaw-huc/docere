import { EsDataType, LayerType, Colors } from '@docere/common'
import { DocereConfig } from '@docere/common'
import { RsType } from '@docere/common'

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
	notes: [],
	pages: [],
	entities: [
		{
			color: Colors.Pink,
			id: 'pos',
			title: 'Part-of-speech tagging'
		},
		{
			color: Colors.Green,
			id: 'org',
		},
		{
			color: Colors.Orange,
			id: 'per',
			type: RsType.Person,
		},
		{
			color: Colors.Blue,
			id: 'loc',
			type: RsType.Location,
		},
		{
			color: Colors.BlueLight,
			id: 'misc',
		},
	],
	layers: [
		{
			active: true,
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

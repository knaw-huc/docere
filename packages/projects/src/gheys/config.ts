import { EsDataType, TextDataExtractionType, LayerType, RsType, Colors } from '@docere/common'
import type { DocereConfig } from '@docere/common'

const config: DocereConfig = {
	slug: 'gheys',
	title: 'Gheborcht Ys',
	// customSettings: [
	// 	{
	// 		id: 'showSuggestions',
	// 		title: 'Show suggestions',
	// 		defaultValue: true
	// 	}
	// ],
	metadata: [
		{
			datatype: EsDataType.Hierarchy,
			id: 'toegang',
			levels: 4,
			order: 10,
			title: '"Toegang"',
		},
		// {
		// 	datatype: EsDataType.Hierarchy,
		// 	id: 'toegang_level1',
		// 	showAsFacet: false,
		// },
		// {
		// 	datatype: EsDataType.Hierarchy,
		// 	id: 'toegang_level2',
		// 	showAsFacet: false,
		// },
		// {
		// 	datatype: EsDataType.Hierarchy,
		// 	id: 'toegang_level3',
		// 	showAsFacet: false,
		// },
		{
			id: 'normalised_dates',
			order: 30,
			title: 'Date',
			datatype: EsDataType.Date,
		},
		{
			id: 'has_date',
			order: 40,
			title: 'Has date',
			datatype: EsDataType.Boolean,
		},
		{
			id: 'keywords',
			order: 50,
		},
		{
			order: 1000,
			id: 'blocks',
			title: 'Block count',
			datatype: EsDataType.Integer,
			interval: 5,
		},
		{
			order: 1020,
			id: 'chars',
			title: 'Character count',
			datatype: EsDataType.Integer,
			interval: 5000,
		},
		{
			order: 1030,
			id: 'n',
			title: 'Order number',
			datatype: EsDataType.Integer,
			interval: 200,
		}
	],
	entities: [
		{
			color: Colors.Blue,
			id: 'person',
			identifier: {
				type: TextDataExtractionType.Attribute,
				attribute: 'ref'
			},
			order: 500,
			title: 'Persons',
			type: RsType.Person
		},
		{
			color: Colors.Orange,
			id: 'location',
			identifier: {
				type: TextDataExtractionType.Attribute,
				attribute: 'ref'
			},
			order: 510,
			type: RsType.Location,
		},
		{
			color: Colors.Orange,
			id: 'loc',
			identifier: {
				type: TextDataExtractionType.Attribute,
				attribute: 'ref'
			},
			order: 520,
			title: 'Location',
			type: RsType.Location,
		},
		{
			id: 'job',
			identifier: {
				type: TextDataExtractionType.Attribute,
				attribute: 'ref'
			},
			order: 530,
		},
		{
			id: 'notary',
			identifier: {
				type: TextDataExtractionType.Attribute,
				attribute: 'ref'
			},
			order: 540,
		},
		{
			id: 'ship',
			identifier: {
				type: TextDataExtractionType.Attribute,
				attribute: 'ref'
			},
			order: 545,
		},
		{
			id: 'good',
			identifier: {
				type: TextDataExtractionType.Attribute,
				attribute: 'ref'
			},
			order: 550,
		},
		{
			id: 'date',
			showAsFacet: false
		},
		{
			color: Colors.Red,
			id: 'string',
			showAsFacet: false,
			showInAside: false,
		}
	],
	layers: [
		{
			// active: false,
			id: 'scan',
			type: LayerType.Facsimile
		},
		{
			// active: false,
			id: 'text',
		},
	]
}

export default config

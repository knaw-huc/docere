import { EsDataType, TextDataExtractionType, LayerType, RsType, Colors } from '@docere/common'
import type { DocereConfig } from '@docere/common'

const config: DocereConfig = {
	slug: 'gheys',
	title: 'Gheborcht Ys',
	collection: {
		metadataId: 'toegang',
		sortBy: 'n'
	},
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
			description: 'Beschrijving van een archief',
			id: 'toegang',
			levels: 4,
			order: 10,
			title: '"Toegang"',
		},
		{
			datatype: EsDataType.Date,
			id: 'normalised_dates',
			interval: 'y',
			order: 30,
			title: 'Date',
		},
		{
			datatype: EsDataType.Boolean,
			id: 'has_date',
			order: 40,
			showInAside: false,
			title: 'Has date',
		},
		{
			description: 'Gebruik kernwoorden om vergelijkbare documenten te vinden',
			id: 'keywords',
			order: 50,
		},
		{
			order: 1000,
			// order 0,
			id: 'blocks',
			title: 'Block count',
			datatype: EsDataType.Integer,
			// interval: 5,
			range: 60,
		},
		{
			collapseFilters: false,
			datatype: EsDataType.Integer,
			id: 'chars',
			// interval: 1000,
			range: 15000,
			order: 1020,
			title: 'Character count',
			// showAsFacet: false
		},
		{
			// interval: 200,
			// showAsFacet: false
			datatype: EsDataType.Integer,
			id: 'n',
			order: 1030,
			range: 4000,
			title: 'Order number',
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

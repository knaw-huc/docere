import { EsDataType, LayerType, RsType, Colors, ExtractedTextData } from '@docere/common'
import type { DocereConfig, ExtractTextData } from '@docere/common'

function extractEntity(name: string): ExtractTextData {
	return function(doc) {
		return Array.from(doc.querySelectorAll(`entity[type~=${name}]`))
			.map((element): ExtractedTextData => ({
				id: element.id,
				value: element.getAttribute('content'),
			}))
	}
}

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
			extract: extractEntity('person'),
			id: 'person',
			order: 500,
			title: 'Persons',
			type: RsType.Person
		},
		{
			color: Colors.Orange,
			extract: extractEntity('location'),
			id: 'location',
			order: 510,
			type: RsType.Location,
		},
		{
			color: Colors.Orange,
			extract: extractEntity('loc'),
			id: 'loc',
			order: 520,
			title: 'Location',
			type: RsType.Location,
		},
		{
			extract: extractEntity('job'),
			id: 'job',
			order: 530,
		},
		{
			extract: extractEntity('notary'),
			id: 'notary',
			order: 540,
		},
		{
			extract: extractEntity('ship'),
			id: 'ship',
			order: 545,
		},
		{
			extract: extractEntity('good'),
			id: 'good',
			order: 550,
		},
		{
			extract: extractEntity('date'),
			id: 'date',
			showAsFacet: false
		},
		{
			color: Colors.Red,
			extract: extractEntity('string'),
			id: 'string',
			showAsFacet: false,
			showInAside: false,
		}
	],
	layers: [
		{
			id: 'scan',
			type: LayerType.Facsimile
		},
		{
			id: 'text',
			type: LayerType.Text
		},
	]
}

export default config

import { EsDataType, LayerType, EntityType, Colors, extendConfigData, ExtractEntity } from '@docere/common'
import extractFacsimiles from './facsimiles'
import { extractNormalisedDates, hasDate } from './metadata'
import prepare from './prepare'

function extractSuggestions(): ExtractEntity {
	return entry => Array.from(entry.document.querySelectorAll(`string[suggestion]`))
		.map(element => ({
			id: element.id,
			content: element.getAttribute('suggestion'),
		}))
}

function extractEntities(type: string): ExtractEntity {
	return entry => 
		Array.from(entry.document.querySelectorAll(`entity[type~=${type}]`))
			.map(element => ({
				id: element.id,
				content: element.getAttribute('content'),
			}))
}

export default extendConfigData({
	slug: 'gheys',
	title: 'Gheborcht Ys',
	collection: {
		metadataId: 'toegang',
		sortBy: 'n'
	},
	metadata: [
		{
			datatype: EsDataType.Hierarchy,
			description: 'Beschrijving van een archief',
			extract: entry => {
				const level0 = /^NAN/.test(entry.id) ? 'VOC' : 'Notariële akte'
				const levels = entry.id.split('/').slice(-1)[0].split('_').slice(0, -1)
				return [level0].concat(levels)
			},
			id: 'toegang',
			levels: 4,
			order: 10,
			title: '"Toegang"',
		},
		{
			datatype: EsDataType.Date,
			extract: extractNormalisedDates,
			id: 'normalised_dates',
			interval: 'y',
			order: 30,
			title: 'Date',
		},
		{
			datatype: EsDataType.Boolean,
			extract: hasDate,
			id: 'has_date',
			order: 40,
			showInAside: false,
			title: 'Has date',
		},
		{
			description: 'Gebruik kernwoorden om vergelijkbare documenten te vinden',
			extract: entry => entry.document.querySelector('meta[key="keywords"]')
				.getAttribute('value')
				.split(' ')
				.filter(x => x.length),
			id: 'keywords',
			order: 50,
		},
		{
			extract: entry => entry.document.querySelectorAll('block').length,
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
			extract: entry => entry.document.documentElement.textContent.length,
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
			extract: entry => parseInt(entry.id.split('_').slice(-1)[0], 10),
			id: 'n',
			order: 1030,
			range: 4000,
			title: 'Order number',
		}
	],
	entities: [
		{
			color: Colors.Blue,
			extract: extractEntities('person'),
			id: 'person',
			order: 500,
			title: 'Person',
			type: EntityType.Person
		},
		{
			color: Colors.Orange,
			extract: extractEntities('location'),
			id: 'location',
			order: 510,
			type: EntityType.Location,
		},
		// {
		// 	color: Colors.Orange,
		// 	extract: extractEntities('loc'),
		// 	id: 'loc',
		// 	order: 520,
		// 	title: 'Location',
		// 	type: RsType.Location,
		// },
		{
			extract: extractEntities('job'),
			id: 'job',
			order: 530,
		},
		{
			extract: extractEntities('notary'),
			id: 'notary',
			order: 540,
		},
		{
			extract: extractEntities('ship'),
			id: 'ship',
			order: 545,
		},
		{
			extract: extractEntities('good'),
			id: 'good',
			order: 550,
		},
		{
			extract: extractEntities('date'),
			id: 'date',
			showAsFacet: false
		},
		{
			color: Colors.Red,
			extract: extractSuggestions(),
			id: 'suggestion',
			showAsFacet: false,
			showInAside: false,
		}
	],
	facsimiles: {
		extract: extractFacsimiles,
	},
	layers: [
		{
			id: 'scan',
			type: LayerType.Facsimile
		},
		{
			id: 'text',
			type: LayerType.Text
		},
	],
	prepare
})

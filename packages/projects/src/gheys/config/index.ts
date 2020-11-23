import { EsDataType, LayerType, EntityType, Colors, extendConfigData, ExtractEntities } from '@docere/common'
import extractFacsimiles from './facsimiles'
import { extractNormalisedDates, hasDate } from './metadata'
import prepare from './prepare'

function extractSuggestions(): ExtractEntities {
	return ({ layerElement, entityConfig }) => Array.from(layerElement.querySelectorAll(entityConfig.selector))
		.map(element => ({
			anchor: element,
			content: element.getAttribute('suggestion'),
		}))
}

function extractEntities(): ExtractEntities {
	return ({ layerElement, entityConfig }) => 
		Array.from(layerElement.querySelectorAll(entityConfig.selector))
			.map(element => ({
				anchor: element,
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
			extract: extractEntities(),
			extractId: el => el.id,
			id: 'person',
			order: 500,
			title: 'Person',
			type: EntityType.Person,
			selector: `entity[type~="person"]`,
		},
		{
			color: Colors.Orange,
			extract: extractEntities(),
			extractId: el => el.id,
			id: 'location',
			order: 510,
			selector: `entity[type~="location"]`,
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
			extract: extractEntities(),
			extractId: el => el.id,
			id: 'job',
			order: 530,
			selector: `entity[type~="job"]`,
		},
		{
			extract: extractEntities(),
			extractId: el => el.id,
			id: 'notary',
			order: 540,
			selector: `entity[type~="notary"]`,
		},
		{
			extract: extractEntities(),
			extractId: el => el.id,
			id: 'ship',
			order: 545,
			selector: `entity[type~="ship"]`,
		},
		{
			extract: extractEntities(),
			extractId: el => el.id,
			id: 'good',
			order: 550,
			selector: `entity[type~="good"]`,
		},
		{
			extract: extractEntities(),
			extractId: el => el.id,
			id: 'date',
			showAsFacet: false,
			selector: `entity[type~="date"]`,
		},
		{
			color: Colors.Red,
			extract: extractSuggestions(),
			extractId: el => el.id,
			id: 'suggestion',
			selector: `string[suggestion]`,
			showAsFacet: false,
			showInAside: false,
		}
	],
	facsimiles: {
		extractFacsimileId: el => el.getAttribute('path'),
		extractFacsimiles,
		selector: 'pb[path]'
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

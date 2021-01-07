import { EsDataType, LayerType, ExtractedEntry, DTAP } from '@docere/common'
import { DocereConfig } from '@docere/common'
import extractFacsimiles from './facsimiles'
import prepare from './prepare'
import { extractLanguages, extractTextTypes } from './metadata'

// function extractEntity(name: string): ExtractEntity {
// 	return entry =>
// 		Array.from(entry.document.querySelectorAll(`ner[type~=${name}]`))
// 			.map(element => ({
// 				id: element.textContent,
// 				content: element.textContent
// 			}))
// }

function getTextContent(selector: string) {
	return (entry: ExtractedEntry) => entry.document.querySelector(selector)?.textContent	
}


const config: DocereConfig = {
	dtap: DTAP.Testing,
	slug: 'gekaaptebrieven',
	title: 'Gekaapte brieven',
	searchResultCount: 20,
	metadata: [
		{
			extract: getTextContent('meta[id="sender"]'),
			id: 'sender',
			title: 'Zender'
		},
		{
			extract: getTextContent('meta[id="recipient"]'),
			id: 'recipient',
			title: 'Ontvanger'
		},
		{
			extract: getTextContent('meta[id="senderprof"]'),
			id: 'senderprof',
			title: 'Beroep zender'
		},
		{
			extract: getTextContent('meta[id="recipientprof"]'),
			id: 'recipientprof',
			title: 'Beroep ontvanger'
		},
		{
			datatype: EsDataType.Date,
			extract: getTextContent('meta[id="date"]'),
			id: 'date',
			interval: 'y',
			order: 10,
			title: 'Datum'
		},
		{
			extract: entry => entry.document.querySelector('meta[id="date"]')?.textContent.trim().length > 1,
			showInAside: false,
			datatype: EsDataType.Boolean,
			id: 'has_date',
			title: 'Datum bekend',
			order: 20,
		},
		{
			extract: getTextContent('meta[id="recipientloc"]'),
			id: 'recipientloc',
			title: 'Locatie ontvanger'
		},
		{
			extract: getTextContent('meta[id="senderloc"]'),
			id: 'senderloc',
			title: 'Locatie zender'
		},
		{
			extract: getTextContent('meta[id="recipientgender"]'),
			id: 'recipientgender',
			title: 'Geslacht ontvanger'
		},
		{
			extract: getTextContent('meta[id="sendergender"]'),
			id: 'sendergender',
			title: 'Geslacht zender'
		},
		{
			extract: getTextContent('meta[id="recipientship"]'),
			id: 'recipientship',
			title: 'Schip ontvanger'
		},
		{
			extract: getTextContent('meta[id="sendership"]'),
			id: 'sendership',
			title: 'Schip zender'
		},
		{
			extract: extractLanguages,
			id: 'languages',
			title: 'Taal'
		},
		{
			extract: extractTextTypes,
			id: 'texttypes',
			title: 'Tekstsoort'
		}
	],
	pages: [
		{ id: 'handleiding' },
		{ id: 'achtergrond', children: [
			{ id: 'gekaaptebrieven', title: 'Gekaapte brieven' },
			{ id: 'transcriptieregels' },
			{ id: 'werkwijze' },
		]},
		{
			id: 'over', title: 'Over deze editie', children: [
				{ id: 'links' },
				{ id: 'publicaties' },
				{ id: 'medewerkers' },
				{ id: 'contact' },
			]
		}
	],
	// entities: [
	// 	{
	// 		color: '#fd7a7a',
	// 		extract: extractEntity('per'),
	// 		id: 'per',
	// 		showInAside: true,
	// 		type: EntityType.Person
	// 	}, {
	// 		color: '#5fb53f',
	// 		extract: extractEntity('org'),
	// 		id: 'org',
	// 		showInAside: true,
	// 		title: 'Organisation',
	// 		type: EntityType.None
	// 	}, {
	// 		color: 'orange',
	// 		extract: extractEntity('loc'),
	// 		id: 'loc',
	// 		showInAside: true,
	// 		title: 'Location',
	// 		type: EntityType.Location
	// 	}, {
	// 		color: '#8080ff',
	// 		extract: extractEntity('misc'),
	// 		id: 'misc',
	// 		showInAside: true,
	// 		title: 'Miscellaneous',
	// 		type: EntityType.None
	// 	}, {
	// 		color: '#8080ff',
	// 		extract: extractEntity('pro'),
	// 		id: 'pro',
	// 		showInAside: true,
	// 		title: 'Products',
	// 		type: EntityType.None
	// 	}
	// ],
	facsimiles: {
		extractFacsimileId: el => el.getAttribute('facs'),
		extractFacsimiles,
		selector: 'pb[facs]',
	},
	layers: [
		{
			active: true,
			id: 'facsimile',
			title: 'Facsimile',
			type: LayerType.Facsimile
		},
		{
			active: true,
			id: 'transcription',
			title: 'Transcription',
			type: LayerType.Text,
		},
	],
	prepare,
}
export default config

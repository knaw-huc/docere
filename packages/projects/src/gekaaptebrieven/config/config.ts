import { EsDataType, EntityType, LayerType, ExtractEntity } from '@docere/common'
import { DocereConfig } from '@docere/common'
import extractFacsimiles from './facsimiles'
import prepare from './prepare'
import { extractLanguages, extractTextTypes } from './metadata'

function extractEntity(name: string): ExtractEntity {
	return entry =>
		Array.from(entry.document.querySelectorAll(`ner[type~=${name}]`))
			.map(element => ({
				id: element.textContent,
				content: element.textContent
			}))
}


const config: DocereConfig = {
	slug: 'gekaaptebrieven',
	title: 'Gekaapte brieven',
	searchResultCount: 20,
	metadata: [
		{
			extract: entry => entry.document.querySelector('meta[id="sender"]').textContent,
			id: 'sender',
			title: 'Zender'
		},
		{
			extract: entry => entry.document.querySelector('meta[id="recipient"]').textContent,
			id: 'recipient',
			title: 'Ontvanger'
		},
		{
			extract: entry => entry.document.querySelector('meta[id="senderprof"]').textContent,
			id: 'senderprof',
			title: 'Beroep zender'
		},
		{
			extract: entry => entry.document.querySelector('meta[id="recipientprof"]').textContent,
			id: 'recipientprof',
			title: 'Beroep ontvanger'
		},
		// {
		// 	showInAside: false,
		// 	id: 'corr',
		// },
		{
			datatype: EsDataType.Date,
			extract: entry => entry.document.querySelector('meta[id="date"]').textContent,
			id: 'date',
			interval: 'y',
			order: 10,
			title: 'Datum'
		},
		{
			extract: entry => entry.document.querySelector('meta[id="date"]')?.textContent.trim().length > 0,
			showInAside: false,
			datatype: EsDataType.Boolean,
			id: 'has_date',
			title: 'Datum bekend',
			order: 20,
		},
		// {
		// 	showInAside: false,
		// 	id: 'sender_or_recipient',
		// 	title: 'Zender of ontvanger'
		// },
		{
			extract: entry => entry.document.querySelector('meta[id="recipientloc"]').textContent,
			id: 'recipientloc',
			title: 'Locatie ontvanger'
		},
		{
			extract: entry => entry.document.querySelector('meta[id="senderloc"]').textContent,
			id: 'senderloc',
			title: 'Locatie zender'
		},
		{
			extract: entry => entry.document.querySelector('meta[id="recipientgender"]').textContent,
			id: 'recipientgender',
			title: 'Geslacht ontvanger'
		},
		{
			extract: entry => entry.document.querySelector('meta[id="sendergender"]').textContent,
			id: 'sendergender',
			title: 'Geslacht zender'
		},
		{
			extract: entry => entry.document.querySelector('meta[id="recipientship"]').textContent,
			id: 'recipientship',
			title: 'Schip ontvanger'
		},
		{
			extract: entry => entry.document.querySelector('meta[id="sendership"]').textContent,
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
	entities: [
		{
			color: '#fd7a7a',
			extract: extractEntity('per'),
			id: 'per',
			showInAside: true,
			type: EntityType.Person
		}, {
			color: '#5fb53f',
			extract: extractEntity('org'),
			id: 'org',
			showInAside: true,
			title: 'Organisation',
			type: EntityType.None
		}, {
			color: 'orange',
			extract: extractEntity('loc'),
			id: 'loc',
			showInAside: true,
			title: 'Location',
			type: EntityType.Location
		}, {
			color: '#8080ff',
			extract: extractEntity('misc'),
			id: 'misc',
			showInAside: true,
			title: 'Miscellaneous',
			type: EntityType.None
		}, {
			color: '#8080ff',
			extract: extractEntity('pro'),
			id: 'pro',
			showInAside: true,
			title: 'Products',
			type: EntityType.None
		}
	],
	facsimiles: {
		extract: extractFacsimiles,
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

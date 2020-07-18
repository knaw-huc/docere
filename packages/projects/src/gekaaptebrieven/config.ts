import { EsDataType, RsType, LayerType, ExtractTextData, ExtractedTextData } from '@docere/common'
import { DocereConfig } from '@docere/common'

function extractEntity(name: string): ExtractTextData {
	return function(doc) {
		return Array.from(doc.querySelectorAll(`ner[type~=${name}]`))
			.map((element): ExtractedTextData => ({
				id: element.textContent,
				value: element.textContent
			}))
	}
}


const config: DocereConfig = {
	slug: 'gekaaptebrieven',
	title: 'Gekaapte brieven',
	searchResultCount: 20,
	metadata: [
		{
			id: 'sender',
			title: 'Zender'
		},
		{
			id: 'recipient',
			title: 'Ontvanger'
		},
		{
			id: 'senderprof',
			title: 'Beroep zender'
		},
		{
			id: 'recipientprof',
			title: 'Beroep ontvanger'
		},
		{
			showInAside: false,
			id: 'corr',
		},
		{
			id: 'date',
			datatype: EsDataType.Date,
			interval: 'y',
			order: 10,
			title: 'Datum'
		},
		{
			showInAside: false,
			datatype: EsDataType.Boolean,
			id: 'has_date',
			title: 'Datum bekend',
			order: 20,
		},
		{
			showInAside: false,
			id: 'sender_or_recipient',
			title: 'Zender of ontvanger'
		},
		{
			id: 'recipientloc',
			title: 'Locatie ontvanger'
		},
		{
			id: 'senderloc',
			title: 'Locatie zender'
		},
		{
			id: 'recipientgender',
			title: 'Geslacht ontvanger'
		},
		{
			id: 'sendergender',
			title: 'Geslacht zender'
		},
		{
			id: 'recipientship',
			title: 'Schip ontvanger'
		},
		{
			id: 'sendership',
			title: 'Schip zender'
		},
		{
			id: 'languages',
			title: 'Taal'
		},
		{
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
			type: RsType.Person
		}, {
			color: '#5fb53f',
			extract: extractEntity('org'),
			id: 'org',
			showInAside: true,
			title: 'Organisation',
			type: RsType.None
		}, {
			color: 'orange',
			extract: extractEntity('loc'),
			id: 'loc',
			showInAside: true,
			title: 'Location',
			type: RsType.Location
		}, {
			color: '#8080ff',
			extract: extractEntity('misc'),
			id: 'misc',
			showInAside: true,
			title: 'Miscellaneous',
			type: RsType.None
		}, {
			color: '#8080ff',
			extract: extractEntity('pro'),
			id: 'pro',
			showInAside: true,
			title: 'Products',
			type: RsType.None
		}
	],
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
	]
}
export default config

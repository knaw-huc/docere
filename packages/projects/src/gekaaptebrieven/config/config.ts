import { EsDataType, LayerType, ExtractedEntry } from '@docere/common'
import { DocereConfig } from '@docere/common'
import extractFacsimiles from './facsimiles'
import prepare from './prepare'
import { extractLanguages, extractTextTypes } from './metadata'

function getValue(selector: string) {
	return (entry: ExtractedEntry) => {
		const value = entry.document.querySelector(selector)?.getAttribute('value')
		return value === 'NULL' ? null : value
	}
}

const config: DocereConfig = {
	slug: 'gekaaptebrieven',
	title: 'Gekaapte brieven',
	searchResultCount: 20,
	metadata: [
		{
			extract: getValue('meta[type="sender"]'),
			id: 'sender',
			title: 'Zender'
		},
		{
			extract: getValue('meta[type="recipient"]'),
			id: 'recipient',
			title: 'Ontvanger'
		},
		{
			extract: getValue('meta[type="senderprof"]'),
			id: 'senderprof',
			title: 'Beroep zender'
		},
		{
			extract: getValue('meta[type="recipientprof"]'),
			id: 'recipientprof',
			title: 'Beroep ontvanger'
		},
		{
			datatype: EsDataType.Date,
			extract: getValue('meta[type="date"]'),
			id: 'date',
			interval: 'y',
			order: 10,
			title: 'Datum'
		},
		{
			extract: entry => entry.document.querySelector('meta[type="date"]')?.textContent.trim().length > 1,
			showInAside: false,
			datatype: EsDataType.Boolean,
			id: 'has_date',
			title: 'Datum bekend',
			order: 20,
		},
		{
			extract: getValue('meta[type="recipientloc"]'),
			id: 'recipientloc',
			title: 'Locatie ontvanger'
		},
		{
			extract: getValue('meta[type="senderloc"]'),
			id: 'senderloc',
			title: 'Locatie zender'
		},
		{
			extract: getValue('meta[type="recipientgender"]'),
			id: 'recipientgender',
			title: 'Geslacht ontvanger'
		},
		{
			extract: getValue('meta[type="sendergender"]'),
			id: 'sendergender',
			title: 'Geslacht zender'
		},
		{
			extract: getValue('meta[type="recipientship"]'),
			id: 'recipientship',
			title: 'Schip ontvanger'
		},
		{
			extract: getValue('meta[type="sendership"]'),
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

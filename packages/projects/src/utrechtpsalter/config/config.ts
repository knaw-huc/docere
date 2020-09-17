import pages from '../data/pages/index.json'
import { LayerType } from '@docere/common'
import type { DocereConfig } from '@docere/common'
import { extractLayerElement } from '../../utils'
import extractFacsimiles from './facsimiles'
import prepare from './prepare'

const config: DocereConfig = {
	collection: {
		metadataId: null,
		sortBy: 'id'
	},
	data: {
		pages
	},
	entrySettings: {
		"panels.text.showLineBeginnings": false,
		"panels.text.showPageBeginnings": false
	},
	slug: 'utrechtpsalter',
	title: 'Utrecht Psalter',
	layers: [
		{
			active: true,
			extract: extractFacsimiles,
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			active: true,
			extract: extractLayerElement('transcription[lang="la"]'),
			id: 'la',
			title: 'Latin',
			type: LayerType.Text,
		},
		{
			active: false,
			extract: extractLayerElement('transcription[lang="nl"]'),
			id: 'nl',
			title: 'Dutch',
			type: LayerType.Text,
		},
		{
			active: false,
			extract: extractLayerElement('transcription[lang="en"]'),
			id: 'en',
			title: 'English',
			type: LayerType.Text,
		},
		{
			active: false,
			extract: extractLayerElement('transcription[lang="fr"]'),
			id: 'fr',
			title: 'French',
			type: LayerType.Text,
		},
	],
	prepare
}

export default config

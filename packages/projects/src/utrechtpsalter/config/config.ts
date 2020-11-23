import pages from '../data/pages/index.json'
import { LayerType } from '@docere/common'
import type { DocereConfig } from '@docere/common'
import { extractLayerElement } from '../../utils'
import extractFacsimiles from './facsimiles'
import prepare from './prepare'

const config: DocereConfig = {
	collection: {
		metadataId: null,
		sortBy: 'n'
	},
	data: {
		pages
	},
	entrySettings: {
		"panels.text.showLineBeginnings": false,
		"panels.text.showPageBeginnings": false
	},
	facsimiles: {
		extractFacsimileId: el => el.textContent,
		extractFacsimiles,
		selector: 'imgLocation'
	},
	slug: 'utrechtpsalter',
	title: 'Utrecht Psalter',
	layers: [
		{
			active: true,
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			active: true,
			extractElement: extractLayerElement('transcription[lang="la"]'),
			id: 'la',
			title: 'Latin',
			type: LayerType.Text,
		},
		{
			active: false,
			extractElement: extractLayerElement('transcription[lang="nl"]'),
			id: 'nl',
			title: 'Dutch',
			type: LayerType.Text,
		},
		{
			active: false,
			extractElement: extractLayerElement('transcription[lang="en"]'),
			id: 'en',
			title: 'English',
			type: LayerType.Text,
		},
		{
			active: false,
			extractElement: extractLayerElement('transcription[lang="fr"]'),
			id: 'fr',
			title: 'French',
			type: LayerType.Text,
		},
	],
	metadata: [
		{
			id: 'n',
			extract: entry => parseInt(entry.id),
		}
	],
	prepare
}

export default config

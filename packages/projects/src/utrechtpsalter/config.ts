import pages from './data/pages/index.json'
import { LayerType } from '@docere/common'
import type { DocereConfig } from '@docere/common'

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
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			active: true,
			id: 'la',
			title: 'Latin',
			type: LayerType.Text,
		},
		{
			active: false,
			id: 'nl',
			title: 'Dutch',
			type: LayerType.Text,
		},
		{
			active: false,
			id: 'en',
			title: 'English',
			type: LayerType.Text,
		},
		{
			active: false,
			id: 'fr',
			title: 'French',
			type: LayerType.Text,
		},
	]
}

export default config

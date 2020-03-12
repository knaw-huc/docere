import pages from './data/pages/index.json'
import { LayerType } from '@docere/common'

const config: DocereConfig = {
	data: {
		pages
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

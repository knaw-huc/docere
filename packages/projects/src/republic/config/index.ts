import { extendConfigData } from '@docere/common'
import { LayerType, EsDataType } from '@docere/common'
import extractFacsimiles from './facsimiles'

export default extendConfigData({
	slug: 'republic',
	title: 'Republic',
	collection: {
		metadataId: 'inventory_num',
		sortBy: 'inventory_num',
	},
	metadata: [
		{
			datatype: EsDataType.Date,
			extract: entry =>
				entry.document.querySelector('meta[key="meeting_date"]')?.getAttribute('value'),
			id: 'date',
			interval: 'd'
		},
		{
			extract: entry =>
				entry.document.querySelector('meta[key="inventory_num"]')?.getAttribute('value'),
			id: 'inventory_num',
		},
		{
			extract: entry =>
				entry.document.querySelector('meta[key="meeting_weekday"]')?.getAttribute('value'),
			id: 'meeting_weekday',
		}	
	],
	entities: [],
	facsimiles: {
		extractFacsimileId: el => el.getAttribute('facs').split('/').slice(-1)[0].replace(/\.jpg$/, ''),
		extractFacsimiles,
		selector: 'column[facs]'
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
	]
})

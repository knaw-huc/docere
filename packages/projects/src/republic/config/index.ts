import { extendConfigData, ExtractEntities, ExtractEntitiesProps } from '@docere/common'
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
	entities: [
		{
			id: 'line',
			extract: extractLbs,
			extractId: el => el.getAttribute('coords'),
			selector: 'line',
			showInAside: false,
			showAsFacet: false,
		}
	],
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

function createFacsimileArea(el: Element, facsimileId: string) {
	const [x, y, w, h] = el.getAttribute('coords').split('_')
	return {
		h,
		facsimileId,
		unit: 'px',
		w,
		x,
		y,
	}
}

function extractLbs({ layerElement }: ExtractEntitiesProps) {
	let facsimileId: string
	let i = 0

	return Array.from(layerElement.querySelectorAll('column'))
		.reduce((prev, column) => {
			if (column.hasAttribute('docere:id')) facsimileId = column.getAttribute('docere:id')

			const lbs = Array.from(column.querySelectorAll('line'))
				.map((el) => {
					i = i + 1
					return {
						anchor: el,
						content: el.textContent,
						n: i.toString(),
						facsimileAreas: [createFacsimileArea(el, facsimileId)]
					}
				})
			return prev.concat(lbs)
		}, [])
}

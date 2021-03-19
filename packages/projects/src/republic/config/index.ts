import { extendConfigData, ExtractEntitiesProps, FacsimileArea, Colors, EntityType } from '@docere/common'
import { LayerType, EsDataType, ExtractMetadata } from '@docere/common'
import extractFacsimiles from './facsimiles'

function extractMetadata(key: string): ExtractMetadata {
	return entry =>
		entry.document.querySelector(`metadata[key="${key}"]`)?.getAttribute('value')
}

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
			extract: extractMetadata('session_date'),
			id: 'date',
			interval: 'd'
		},
		{
			extract: extractMetadata('inventory_num'),
			id: 'inventory_num',
		},
		{
			extract: extractMetadata('session_weekday'),
			id: 'session_weekday',
		},	
		{
			extract: extractMetadata('president'),
			id: 'president',
		}	
	],
	entities: [
		{
			color: Colors.Green,
			id: 'line',
			extract: extractLbs,
			extractId: el => el.getAttribute('coords'),
			selector: 'line',
			showInAside: false,
			showAsFacet: false,
		},
		{
			id: 'attendant',
			extract: ({ entityConfig, layerElement }) => {
				return Array.from(layerElement.querySelectorAll(entityConfig.selector))
					.map(el => {
						return {
							anchor: el,
							content: el.textContent,
						}
					})
			},
			extractId: el => el.id,
			selector: 'attendant',
			type: EntityType.Person,
		}
	],
	facsimiles: {
		extractFacsimileId: el => el.id,
		extractFacsimiles,
		selector: 'scan[id]'
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

function createFacsimileArea(el: Element, facsimileId: string): FacsimileArea {
	const [y, x, w, h] = el.getAttribute('coords')
		.split('_')
		.map(x => parseInt(x, 10))

	return {
		h,
		facsimileId,
		unit: 'px',
		w,
		x,
		y,
	}
}

function getLineN(id: string) {
	const splits = id.split('-')
	return (parseInt(splits[splits.length - 1], 10) + 1).toString()
}

function extractLbs({ layerElement }: ExtractEntitiesProps) {
	return Array.from(layerElement.querySelectorAll('line'))
		.map(line => {
			return {
				anchor: line,
				content: null,
				n: getLineN(line.id),
				facsimileAreas: [createFacsimileArea(line, line.getAttribute('scan_id'))]
			}
		})
}

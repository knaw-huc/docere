import { extendConfigData, ExtractEntitiesProps, FacsimileArea, Colors, EntityType } from '@docere/common'
import { LayerType, EsDataType, ExtractMetadata } from '@docere/common'
import extractFacsimiles from './facsimiles'

function extractMetadata(key: string): ExtractMetadata {
	return entry =>
		entry.document.querySelector(`meta[key="${key}"]`)?.getAttribute('value')
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
			extractId: el => el.id,
			selector: 'line',
			showInAside: false,
			showAsFacet: false,
		},
		{
			color: Colors.Red,
			id: 'resolution',
			extract: extractResolutions,
			extractId: el => el.id,
			selector: 'resolution',
			showInAside: false,
			showAsFacet: false,
		},
		{
			color: Colors.Red,
			id: 'attendance_list',
			extract: extractResolutions,
			extractId: el => el.id,
			selector: 'attendance_list',
			showInAside: false,
			showAsFacet: false,
			title: 'Attendance list'
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
			extractId: el => el.getAttribute('delegate_id'),
			selector: 'attendant',
			type: EntityType.Person,
		}
	],
	facsimiles: {
		extractFacsimileId: el => el.id, //getAttribute('filepath'),
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

// function coordsToFacsimileArea(el: Element) {
// 	return function(coords: string): FacsimileArea {
// 		const [x, y, w, h] = coords
// 			.split('_')
// 			.map(x => parseInt(x, 10))

// 		return {
// 			facsimileId: el.getAttribute('scan_id'),
// 			h,
// 			unit: 'px',
// 			w,
// 			x,
// 			y,
// 		}
// 	}
// }

function createFacsimileArea(el: Element): FacsimileArea {
	if (!el.hasAttribute('coords')) return null

	return {
		facsimileId: el.getAttribute('scan_id'),
		points: el.getAttribute('coords')
			.split(' ')
			.map(coord =>
				coord.split(',')
					.map(c => parseInt(c, 10)) as [number, number]
			)
	}
}

// function getLineN(id: string) {
// 	const splits = id.split('_')
// 	return (parseInt(splits[splits.length - 1], 10) + 1).toString()
// }

function extractLbs({ layerElement }: ExtractEntitiesProps) {
	return Array.from(layerElement.querySelectorAll('line'))
		.map(line => {
			return {
				anchor: line,
				content: null,
				// n: getLineN(line.id),
				facsimileAreas: [createFacsimileArea(line)]
			}
		})
}

function extractResolutions({ layerElement, entityConfig }: ExtractEntitiesProps) {
	// console.log(Array.from(layerElement.querySelectorAll(entityConfig.selector)))
	return Array.from(layerElement.querySelectorAll(entityConfig.selector))
		.map(res => {
			return {
				anchor: res,
				content: null,
				facsimileAreas: res.getAttribute('coords').split('__')
					.map(coords => ({
						facsimileId: res.getAttribute('scan_id'),
						points: coords
							.split(' ')
							.map(coord =>
								coord.split(',')
									.map(c => parseInt(c, 10)) as [number, number]
							)
					}))
			}
		})
}


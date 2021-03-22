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

function createFacsimileArea(el: Element): FacsimileArea[] {
	return el.getAttribute('coords')
		.split(' ')
		.map(coords => {
			const [x, y, w, h] = coords
				.split('_')
				.map(x => parseInt(x, 10))

			return {
				h,
				facsimileId: el.getAttribute('scan_id'),
				unit: 'px',
				w,
				x,
				y,
			} as FacsimileArea
		})
}

function getLineN(id: string) {
	const splits = id.split('_')
	return (parseInt(splits[splits.length - 1], 10) + 1).toString()
}

function extractLbs({ layerElement }: ExtractEntitiesProps) {
	return Array.from(layerElement.querySelectorAll('line'))
		.map(line => {
			return {
				anchor: line,
				content: null,
				n: getLineN(line.id),
				facsimileAreas: createFacsimileArea(line)
			}
		})
}

function extractResolutions({ layerElement }: ExtractEntitiesProps) {
	return Array.from(layerElement.querySelectorAll('resolution'))
		.map(res => {
			return {
				anchor: res,
				content: null,
				facsimileAreas: createFacsimileArea(res)
			}
		})
}


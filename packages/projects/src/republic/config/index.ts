import { extendConfig, Colors, EntityType } from '@docere/common'
import { LayerType, EsDataType } from '@docere/common'
import { prepareAnnotations, prepareSource } from './prepare'

const annotationHierarchy = ['scan', 'attendance_list', 'resolution', 'paragraph', 'text_region', 'line', 'attendant']

export default extendConfig({
	standoff: {
		prepareSource,
		prepareAnnotations,
		exportOptions: {
			annotationHierarchy,
			rootNodeName: 'session',
			metadata: {
				exclude: ['coords', 'para_id', 'scan_id', 'text_region_id', 'iiif_url', 'filepath', 'iiif_info_url']
			}
		}
	},

	slug: 'republic',

	title: 'Republic',

	collection: {
		metadataId: 'inventory_num',
		sortBy: 'inventory_num',
	},

	metadata2: [
		{
			datatype: EsDataType.Date,
			id: 'date',
			interval: 'd'
		},
		{
			id: 'inventory_num',
		},
		{
			id: 'session_weekday',
		},	
		{
			id: 'president',
		}	
	],

	// createFacsimiles: (props) => props.tree
	// 	.filter(a => a.name === 'scan')
	// 	.map((curr) => ({
	// 		id: curr.id,
	// 		path: curr.metadata._facsimilePath,
	// 	})),

	facsimiles: {
		filter: a => a.name === 'scan',
		getPath: a => a.metadata.iiif_info_url
	},

	entities2: [
		{
			color: Colors.Green,
			filter: (a => a.name === 'line'),
			id: 'line',
			showAsFacet: false,
			showInAside: false,
		},
		{
			color: Colors.Red,
			filter: (a => a.name === 'resolution'),
			id: 'resolution',
			showInAside: false,
			showAsFacet: false,
		},
		{
			color: Colors.Red,
			filter: (a => a.name === 'attendance_list'),
			id: 'attendance_list',
			showInAside: false,
			showAsFacet: false,
			title: 'Attendance list'
		},
		{
			id: 'attendant',
			filter: a => a.name === 'attendant',
			getId: a => a.metadata.delegate_id,
			type: EntityType.Person,
		}
	],
	
	layers2: [
		{
			id: 'scan',
			type: LayerType.Facsimile
		},
		{
			id: 'text',
			type: LayerType.Text
		},
	],
})

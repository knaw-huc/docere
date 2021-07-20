import { extendConfig, Colors, EntityType } from '@docere/common'
import { LayerType, EsDataType } from '@docere/common'
// import config from '../../suriano/config'
import { prepareAnnotations, prepareSource } from './prepare'

const annotationHierarchy = ['attendance_list', 'resolution', 'paragraph', 'text_region', 'line', 'attendant', 'scan']

export default extendConfig({
	standoff: {
		prepareSource,
		prepareAnnotations,
		exportOptions: {
			annotationHierarchy,
			rootNodeName: 'session',
			metadata: {
				exclude: ['coords', 'para_id', 'scan_id', 'text_region_id', 'iiif_url', 'filepath', 'iiif_info_url'],
				addOffsets: true,
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
			facet: {
				datatype: EsDataType.Date,
				interval: 'd',
			},
			id: 'session_date',
		},
		{
			facet: {
				datatype: EsDataType.Keyword,
			},
			id: 'inventory_num',
		},
		{
			facet: {
				datatype: EsDataType.Keyword,
			},
			id: 'session_weekday',
		},	
		{
			facet: {
				datatype: EsDataType.Keyword,
			},
			entityConfigId: 'attendant',
			id: 'president',
			filterEntities: a => a.metadata.class === 'president',
		}	
	],

	facsimiles: {
		filter: a => a.name === 'scan',
		getPath: a => a.metadata.iiif_info_url
	},

	entities2: [
		{
			color: Colors.Green,
			filter: (a => a.name === 'line'),
			id: 'line',
			showInAside: false,
		},
		{
			color: Colors.Red,
			filter: (a => a.name === 'resolution'),
			id: 'resolution',
			showInAside: false,
		},
		{
			color: Colors.Red,
			filter: (a => a.name === 'attendance_list'),
			id: 'attendance_list',
			showInAside: false,
			title: 'Attendance list'
		},
		{
			facet: {
				datatype: EsDataType.Keyword,
			},
			id: 'attendant',
			filter: a => a.name === 'attendant',
			getId: a => a.metadata.delegate_id,
			getValue: a => a.metadata.delegate_name,
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

	parts: [
		{
			id: 'session',
		},
		{
			id: 'resolution',
			filter: a => a.name === 'resolution',
			getId: a => a.metadata._entityId,
		}
	]
})

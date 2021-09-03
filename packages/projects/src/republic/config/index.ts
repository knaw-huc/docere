import { extendConfig, Colors, EntityType, MetadataConfig, CreateJsonEntryPartProps } from '@docere/common'
import { LayerType, EsDataType } from '@docere/common'
import { prepareAnnotations, prepareSource } from './prepare'

const annotationHierarchy = ['attendance_list', 'resolution', 'paragraph', 'text_region', 'line', 'attendant', 'scan']

const getValue = (config: MetadataConfig, props: CreateJsonEntryPartProps) =>
	(props.partConfig.id === 'session') ?
		props.root.metadata[config.id] :
		props.sourceTree.root.metadata[config.id]

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

	title: 'Webeditie Resoluties Staten Generaal - prototype achttiende eeuw',

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
			getValue,
		},
		{
			facet: {
				datatype: EsDataType.Keyword,
			},
			id: 'inventory_num',
			getValue,
		},
		{
			facet: {
				datatype: EsDataType.Keyword,
			},
			id: 'session_weekday',
			getValue,
		},	
		{
			facet: {
				datatype: EsDataType.Keyword,
			},
			entityConfigId: 'attendant',
			id: 'president',
			filterEntities: a => a.metadata.class === 'president',
		},
		{
			id: 'session',
			getValue: (_config, props) => {
				if (props.partConfig.id === 'session') return
				return props.sourceTree.root.metadata.id
			}
		},
		{
			id: 'resolutions',
			getValue: (_config, props) => {
				if (props.partConfig.id === 'resolution') return
				return props.sourceTree
					.filter(a => a.name === 'resolution')
					.map(a => a.metadata.id)
			}
		}	
	],

	facsimiles: {
		filter: a => a.name === 'scan',
		getPath: props => props.annotation.metadata.iiif_info_url
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
			getValue: props => props.annotation.metadata.delegate_name,
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
			type: LayerType.Text,
		},
	],

	parts: [
		{
			id: 'session',
			getId: a => a.metadata.id
		},
		{
			id: 'resolution',
			filter: a => a.name === 'resolution',
			getId: a => a.metadata._entityId,
		}
	]
})

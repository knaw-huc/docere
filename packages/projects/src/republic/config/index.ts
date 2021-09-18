import { extendConfig, Colors, EntityType, MetadataConfig, CreateJsonEntryPartProps, PartialStandoff, PartConfig } from '@docere/common'
import { LayerType, EsDataType } from '@docere/common'
import { prepareSource } from './prepare'

const annotationHierarchy = ['attendance_list', 'resolution', 'paragraph', 'text_region', 'line', 'attendant', 'scan']

// TODO restore getValue
const getValue = (config: MetadataConfig, props: CreateJsonEntryPartProps) => {
	return props.partialStandoff.metadata[config.id]
}

export default extendConfig({
	standoff: {
		prepareSource,
		prepareStandoff,
		// prepareAnnotations,
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
			id: 'resolution_ids',
			getValue,
		},
		{
			id: 'session_id',
			getValue: (_config, props) => props.partialStandoff.metadata.id
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
			filterEntities: a => a.sourceProps.class === 'president',
		},
		// {
		// 	id: 'session',
		// 	getValue: (_config, props) => {
		// 		if (props.partConfig.id === 'session') return
		// 		return props.sourceTree.root.metadata.id
		// 	}
		// },
		// {
		// 	id: 'resolutions',
		// 	getValue: (_config, props) => {
		// 		if (props.partConfig.id === 'resolution') return
		// 		return props.sourceTree
		// 			.filter(a => a.name === 'resolution')
		// 			.map(a => a.metadata.id)
		// 	}
		// }	
	],

	facsimiles: {
		filter: a => a.name === 'scan',
		getPath: props => props.annotation.sourceProps.iiif_info_url
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
			filter: (a => a.sourceProps.type === 'resolution'),
			id: 'resolution',
			showInAside: false,
			title: 'Resolutie',
		},
		{
			color: Colors.Red,
			filter: (a => a.sourceProps.type === 'attendance_list'),
			id: 'attendance_list',
			showInAside: false,
			title: 'Presentielijst'
		},
		{
			facet: {
				datatype: EsDataType.Keyword,
			},
			id: 'attendant',
			filter: a => a.name === 'attendant',
			getId: a => a.sourceProps.delegate_id,
			getValue: props => props.annotation.sourceProps.delegate_name,
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

	pages: {
		config: [
			{
				title: "Home",
				url: "https://republic.huygens.knaw.nl"
			},
			{
				title: "Documentatie",
 				url: "https://republic.huygens.knaw.nl/index.php/protoype"
			}
		]
	},

	parts: [
		{
			id: 'session',
			getId: a => a.sourceProps.id
		},
		{
			id: 'attendance_list',
			filter: a => a.sourceProps.type === 'attendance_list',
			getId: a => a.props.entityId,
		},
		{
			id: 'resolution',
			filter: a => a.sourceProps.type === 'resolution',
			getId: a => a.props.entityId,
		}
	]
})

function prepareStandoff(
	entryPartialStandoff: PartialStandoff,
	sourcePartialStandoff: PartialStandoff,
	partConfig: PartConfig
) {
	/**
	 * Attendance lists and resolutions are part of a session. When the source (session)
	 * is splitted into attendance lists and resolution, the data on which scan 
	 */
	if (partConfig?.id === 'attendance_list' || partConfig?.id === 'resolution') {
		const scan = entryPartialStandoff.annotations.find(a => a.name === 'scan' && a.start === 0)
		if (scan == null ) {
			const firstTextRegion = entryPartialStandoff.annotations.find(a => a.name === 'text_region')
			const scan = sourcePartialStandoff.annotations.find(a => a.id === firstTextRegion.sourceProps.scan_id)
			const root = entryPartialStandoff.annotations.find(a => a.props.entityConfigId === partConfig.id)
			root.props.facsimileId = scan.props.facsimileId
			root.props.facsimilePath = scan.props.facsimilePath

			// const first0 = entryPartialStandoff.annotations.find(a => a.start === 0)
			// const sourceFirst0 = sourcePartialStandoff.annotations.find(a => a.id === first0.id)
			// const scans = sourcePartialStandoff.annotations
			// 	.filter(a => a.name === 'scan')
			// 	.sort((a, b) => a.start - b.start)

			// if (scans != null) {
			// 	let i = 0
			// 	while (i < scans.length && scans[i].start < sourceFirst0.start) i++
			// 	const foundScan = scans[i - 1]
			// 	const root = entryPartialStandoff.annotations.find(a => a.props.entityConfigId === partConfig.id)
			// 	root.props.facsimileId = foundScan.props.facsimileId
			// 	root.props.facsimilePath = foundScan.props.facsimilePath
			// }
		}
	}
	return entryPartialStandoff
}

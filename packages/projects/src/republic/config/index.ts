import { extendConfig, Colors, EntityType, MetadataConfig, CreateJsonEntryPartProps, PartialStandoff, PartConfig, Language, SortDirection } from '@docere/common'
import { LayerType, EsDataType } from '@docere/common'
import { prepareSource } from './prepare'

const annotationHierarchy = ['attendance_list', 'resolution', 'paragraph', 'text_region', 'line', 'attendant', 'scan']

const getValue = (config: MetadataConfig, props: CreateJsonEntryPartProps) => {
	return props.partialStandoff.metadata[config.id].toString()
}

const typeTranslation: Record<string, string> = {
	resolution: 'resolutie',
	attendance_list: 'presentielijst',
	session: 'zittingsdag'
}

const dayTranslation: Record<string, string> = {
	Jovis: 'donderdag',
	Martis: 'dinsdag',
	Lunae: 'maandag',
	Sabbathi: 'zaterdag',
	Veneris: 'vrijdag',
	Mercurii: 'woensdag',

}

export default extendConfig({
	standoff: {
		prepareSource,
		prepareStandoff,
		exportOptions: {
			annotationHierarchy,
			metadata: {
				exclude: ['coords', 'para_id', 'scan_id', 'text_region_id', 'iiif_url', 'filepath', 'iiif_info_url'],
				addOffsets: true,
			}
		}
	},

	slug: 'republic',

	title: 'Webeditie Resoluties Staten-Generaal - prototype achttiende eeuw',

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
			title: 'Datum',
		},
		{
			id: 'resolution_ids',
			getValue: (config, props) => props.partialStandoff.metadata[config.id]
		},
		{
			id: 'session_id',
			getValue: (_config, props) => props.partialStandoff.metadata.id
		},
		{
			id: 'order_number',
			getValue: (_config, props) =>
				props.partConfig.id === 'resolution' ?
					props.partialStandoff.metadata.resolution_ids.indexOf(props.id) + 1 :
					null
			,
			title: 'Volgnummer'
		},
		{
			facet: {
				datatype: EsDataType.Keyword,
			},
			id: 'inventory_num',
			getValue,
			title: 'Inventarisnummer'
		},
		{
			facet: {
				datatype: EsDataType.Keyword,
			},
			id: 'session_weekday',
			getValue: (config, props) =>
				dayTranslation[props.partialStandoff.metadata[config.id]],
			title: 'Dag',
		},	
		{
			facet: {
				datatype: EsDataType.Keyword,
			},
			entityConfigId: 'attendant',
			id: 'president',
			filterEntities: a => a.sourceProps.class === 'president',
			title: 'Voorzitter'
		},
		{
			facet: {
				datatype: EsDataType.Keyword,
				order: 0,
			},
			id: 'type',
			getValue: (_config, props) => typeTranslation[props.partConfig.id],
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
		// 		return props.partialStandoff.metadata.sourceMetadata.resolutions
		// 			// .filter(a => a.name === 'resolution')
		// 			// .map(a => a.metadata.id)
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
			title: 'Aanwezigen',
			type: EntityType.Person,
		}
	],

	language: Language.NL,
	
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
	],

	search: {
		sortOrder: new Map([['session_date', SortDirection.Asc]])
	}
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
		}
	}

	/**
	 * Remove text regions, because they are not rendered in the client
	 */
	entryPartialStandoff.annotations = entryPartialStandoff.annotations.filter(a => a.name !== 'text_region')

	return entryPartialStandoff
}

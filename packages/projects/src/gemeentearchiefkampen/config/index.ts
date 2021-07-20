import { CreateJsonEntryPartProps, extendConfig, LayerType, MetadataConfig } from '@docere/common'
// import { LayerType, EsDataType } from '@docere/common'
// import config from '../../suriano/config'
import { prepareSource } from './prepare'

function getValue(config: MetadataConfig, props: CreateJsonEntryPartProps) {
	const annotation = props.sourceTree.annotations.find(
		a => a.name === 'item' && a.metadata.key === config.id
	)
	return annotation.metadata.value
}

const metadataItems = [
	'Name of object',
	'Title of text',
	'Name of author',
	'Folio number',
	'Folio side',
	'Column on page',
	'Scribe',
	'Collectie',
	'Inventory number',
	'Scan(s)',
	'Language',
	'Location',
	'Editor',
	'Handwriting',
	'Scribe margin',
	'Material',
	'Watermark',
	'Written space'
]

export default extendConfig({
	documents: {
		type: 'json'
	},

	standoff: {
		prepareSource,
	},

	slug: 'gemeentearchiefkampen',

	title: 'Gemeentearchief Kampen',

	metadata2: metadataItems.map(id => ({
		facet: {},
		id,
		getValue,
	})),

	// facsimiles: {
	// 	filter: a => a.name === 'scan',
	// 	getPath: a => a.metadata.iiif_info_url
	// },

	entities2: [
		// {
		// 	color: Colors.Green,
		// 	filter: (a => a.name === 'line'),
		// 	id: 'line',
		// 	showInAside: false,
		// },
		// {
		// 	color: Colors.Red,
		// 	filter: (a => a.name === 'resolution'),
		// 	id: 'resolution',
		// 	showInAside: false,
		// },
		// {
		// 	color: Colors.Red,
		// 	filter: (a => a.name === 'attendance_list'),
		// 	id: 'attendance_list',
		// 	showInAside: false,
		// 	title: 'Attendance list'
		// },
		// {
		// 	facet: {
		// 		datatype: EsDataType.Keyword,
		// 	},
		// 	id: 'attendant',
		// 	filter: a => a.name === 'attendant',
		// 	getId: a => a.metadata.delegate_id,
		// 	getValue: a => a.metadata.delegate_name,
		// 	type: EntityType.Person,
		// }
	],
	
	layers2: [
		{
			findRoot: a => a.name === 'div' && a.metadata.id === 'diplomatic',
			id: 'diplomatic',
			type: LayerType.Text,
		},
		{
			findRoot: a => a.name === 'div' && a.metadata.id === 'comments',
			id: 'comments',
			type: LayerType.Text,
		},
		{
			findRoot: a => a.name === 'div' && a.metadata.id === 'critical',
			id: 'critical',
			type: LayerType.Text,
		},
		{
			findRoot: a => a.name === 'div' && a.metadata.id === 'translation',
			id: 'translation',
			type: LayerType.Text,
		},
		// {
		// 	id: 'scan',
		// 	type: LayerType.Facsimile
		// },
		// {
		// 	id: 'text',
		// 	type: LayerType.Text
		// },
	],
})

import { extendConfig, LayerType, Colors, EntityType, EsDataType } from '@docere/common'
import { hasMetadataValue } from '../../utils'

export default extendConfig({
	// collection: {
	// 	metadataId: 'filza',
	// 	sortBy: 'letterno',
	// },
	documents: {
		type: 'xml',
		remoteDirectories: [
			'suriano/letters',
		],
	},
	slug: 'suriano',
	title: "Suriano",
	private: true,
	metadata2: [
		{
			facet: {
				description: 'Dit is een test om wat te zien',
			},
			id: 'sender',
			getValue: (_config, props) => {
				const annotation = props.sourceTree.findChild(
					a => a.name === 'correspAction' && a.metadata.type === 'sent',
					a => a.name === 'name'
				)
				return props.sourceTree.getTextContent(annotation)
			}
		},
		{
			facet: {},
			id: 'sender_place',
			getValue: (_config, props) => {
				const annotation = props.sourceTree.findChild(
					a => a.name === 'correspAction' && a.metadata.type === 'sent',
					a => a.name === 'settlement'
				)
				return props.sourceTree.getTextContent(annotation)
			}
		},
		{
			facet: {
				datatype: EsDataType.Date,
				interval: 'y',
			},
			getValue: (_config, props) => {
				const annotation = props.sourceTree.findChild(
					a => a.name === 'correspAction' && a.metadata.type === 'sent',
					a => a.name === 'date'
				)
				return annotation.metadata.when.trim()
			},
			id: 'sender_date',
		},
		{
			facet: {},
			getValue: (_config, props) => {
				const annotation = props.sourceTree.find(
					a => a.name === 'idno' && a.metadata.type === 'filza'
				)
				return props.sourceTree.getTextContent(annotation)
			},
			id: 'filza',
		},
		{
			facet: {},
			getValue: (_config, props) => {
				const annotation = props.sourceTree.find(
					a => a.name === 'idno' && a.metadata.type === 'letterno'
				)
				return props.sourceTree.getTextContent(annotation)
			},
			id: 'letterno',
		},
		{
			facet: {},
			id: 'settlement',
			getValue: (_config, props) => {
				const annotation = props.sourceTree.findChild(
					a => a.name === 'msIdentifier',
					a => a.name === 'settlement'
				)
				return props.sourceTree.getTextContent(annotation)
			},
		},
		{
			facet: {},
			id: 'insitution',
			getValue: (_config, props) => {
				const annotation = props.sourceTree.findChild(
					a => a.name === 'msIdentifier',
					a => a.name === 'institution'
				)
				return props.sourceTree.getTextContent(annotation)
			},
		},
		{
			facet: {},
			id: 'collection',
			getValue: (_config, props) => {
				const annotation = props.sourceTree.findChild(
					a => a.name === 'msIdentifier',
					a => a.name === 'collection'
				)
				return props.sourceTree.getTextContent(annotation)
			},
		},
		{
			facet: {},
			getValue: (_config, props) => {
				const annotation = props.sourceTree.find(
					a => a.name === 'biblScope'
				)
				return props.sourceTree.getTextContent(annotation)
			},
			id: 'biblScope',
		},
		{
			getValue: (_config, props) => {
				const annotation = props.sourceTree.find(
					a => a.name === 'div' && a.metadata.type === 'summary'
				)
				return props.sourceTree.getTextContent(annotation)
			},
			id: 'summary',
		}
	],
	entities2: [
		{
			color: Colors.BlueBright,
			id: 'note',
			filter: a => a.name === 'ptr' && hasMetadataValue(a, 'target'),
			getId: a => a.metadata.target.slice(1),
			title: "Notes",
			type: EntityType.Note,
			showInAside: false,
		},
		{
			color: Colors.Pink,
			id: 'personography',
			filter: a => a.name === 'rs' && a.metadata.type === 'pers',
			getId: a => a.metadata.key,
			title: "Persons",
			type: EntityType.Person,
		},
	],

	facsimiles: {
		filter: a => a.name === 'pb',
		getId: a => a.metadata['xml:id'],
		getPath: props => {
			const { _facsimileId: id } = props.annotation.metadata

			const pageNumber = parseInt(id.slice(1, 3))
			const rv = id.slice(3)

			let irrelevantNumber = (pageNumber * 2) + 5
			if (rv === 'v') irrelevantNumber += 1
			
			const imgPath = 'Senato-dispacci-ambasciatori-e-residenti-Signori-Stati-filza-2' //0271_133-r'
			return `/iiif/suriano/${imgPath}/${imgPath}_0${irrelevantNumber}_0${pageNumber}-${rv}.jpg/info.json`
		}
	},

	layers2: [
		{
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			findRoot: a => a.name === 'div' && a.metadata.type === 'original',
			id: 'text',
			type: LayerType.Text,
		},
		{
			findRoot: a => a.name === 'div' && a.metadata.type === 'summary',
			id: 'summary',
			type: LayerType.Text,
		},
	],
	pages: {
		config: [
			{
				id: 'biblio',
				remotePath: 'suriano/pages/Biblio.xml',
				// split: {
				// 	extractId: (el) => el.getAttribute('xml:id'),
				// 	selector: 'bibl',
				// },
				title: 'Bibliography'
			},
			{
				id: 'personography',
				remotePath: 'suriano/pages/Personography.xml',
				// split: {
				// 	extractId: (el) => el.getAttribute('xml:id'),
				// 	selector: 'person',
				// },
				title: 'Personography'
			},
		],
	}
})

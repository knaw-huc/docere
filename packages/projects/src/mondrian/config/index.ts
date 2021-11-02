import { extendConfig, Colors, EntityType, LayerType, EsDataType, isChild, countChildren, createPartialStandoffFromAnnotation } from '@docere/common'

export default extendConfig({
	documents: {
		// remoteDirectories: [
		// 	'mondrian/editie-conversie/geschriften',
		// 	'mondrian/editie-conversie/brieven/04_Transcriptie_DEF'
		// ],
		type: 'xml'
	},

	metadata2: [
		{
			facet: {
				datatype: EsDataType.Date,
				interval: 'y',
				order: 10,
			},
			getValue: (_config, props) => {
				const sentAnno = props.source.annotations.find(a =>
					a.name === 'correspAction' && a.sourceProps.type === 'sent'
				)
				const dateAnno = props.source.annotations.find(a =>
					a.name === 'date' && isChild(a, sentAnno)
				)
				return dateAnno?.sourceProps.when
			},
			id: 'date',
		},
		{
			facet: {
				order: 15,
			},
			getValue: (_config, props) =>
				props.id.slice(0, 7) === 'brieven' ? 'brief' : 'geschrift'
			,
			id: 'type',
		},
		{
			facet: {
				datatype: EsDataType.Boolean,
				order: 15,
			},
			getValue: (_config, props) =>
				[
					'19090421y_IONG_1304',
					'19140505_BREM_0049',
					'19140607_SCHE_0050',
					'19140609_SCHE_PM_5006',
					'19140927_ASSE_0057',
					'19141111_ASSE_1760'
				].indexOf(props.id) > -1,
			id: 'special',
		},
		{
			facet: {
				order: 20,
			},
			getValue: (_config, props) => {
				const sentAnno = props.source.annotations.find(
					a => a.name === 'correspAction' && a.sourceProps.type === 'sent'
				)

				const nameAnno = props.source.annotations.find(
					a => a.name === 'name' && isChild(a, sentAnno)
				)

				if (nameAnno == null) return null
				return props.source.text.slice(nameAnno.start, nameAnno.end)
			},
			id: 'author',
		},
		{
			facet: {
				order: 30,
			},
			getValue: (_config, props) => {
				const recAnno = props.source.annotations.find(
					a => a.name === 'correspAction' && a.sourceProps.type === 'received'
				)

				const nameAnno = props.source.annotations.find(
					a => a.name === 'name' && isChild(a, recAnno)
				)

				if (nameAnno == null) return null
				return props.source.text.slice(nameAnno.start, nameAnno.end)
			},
			id: 'addressee',
		},
		{
			facet: {
				order: 40,
			},
			getValue: (_config, props) => {
				const recAnno = props.source.annotations.find(
					a => a.name === 'correspAction' && a.sourceProps.type === 'sent'
				)

				const nameAnno = props.source.annotations.find(
					a => a.name === 'placeName' && isChild(a, recAnno)
				)

				if (nameAnno == null) return null
				return props.source.text.slice(nameAnno.start, nameAnno.end)
			},
			id: 'place',
		},
		{
			facet: {
				datatype: EsDataType.Integer,
				range: 100,
			},
			getValue: (_config, props) => {
				return countChildren(
					props.source.annotations,
					a => a.name === 'div' && a.sourceProps.type === 'notes',
					a => a.name === 'note'
				)
			},
			id: 'noteCount',
		},
		{
			facet: {
				datatype: EsDataType.Integer,
				range: 100,
			},
			getValue: (_config, props) => {
				return countChildren(
					props.source.annotations,
					a => a.name === 'div' && a.sourceProps.type === 'ogtnotes',
					a => a.name === 'note'
				)
			},
			id: 'ogtNoteCount',
		},
		{
			facet: {
				datatype: EsDataType.Integer,
				range: 100,
			},
			getValue: (_config, props) => {
				return countChildren(
					props.source.annotations,
					a => a.name === 'div' && a.sourceProps.type === 'typednotes',
					a => a.name === 'note'
				)
			},
			id: 'typedNoteCount',
		},
		{
			facet: {
				datatype: EsDataType.Boolean,
			},
			getValue: (_config, props) => {
				const root = props.source.annotations
					.find(a =>
						a.name === 'div' && a.sourceProps.type === 'translation'
					)

				if (root == null) return false
				return props.source.text.slice(root.start, root.end).trim().length > 0
			},
			id: 'hasTranslation',
		}
	],
	entities2: [
		{
			color: Colors.Green,
			facet: {
				order: 80,
			},
			filter: a =>
				a.name === 'rs' &&
				a.sourceProps.type === 'artwork-m' && 
				a.sourceProps.key?.length > 0
			,
			getId: a => a.sourceProps.key,
			getValue: props => props.annotation.sourceProps.key,
			id: 'rkd-artwork-link',
			title: 'Artwork',
			type: EntityType.Artwork,
		},
		{
			color: Colors.Blue,
			id: 'biblio',
			facet: {
				order: 90,
			},
			filter: a =>
				a.name === 'ref' &&
				a.sourceProps.target?.slice(0, 11) === 'biblio.xml#',
			// extract: ({ entityConfig, entry }) => Array.from(entry.preparedElement.querySelectorAll(entityConfig.selector))
			// 	.map(x => ({
			// 		anchor: x,
			// 		content: x.textContent,
			// 	})),
			getId: a => a.sourceProps.target.split('#')[1],
			getValue: props => props.annotation.sourceProps.target.split('#')[1],
			type: EntityType.PagePart,
			// selector: 'ref[target^="biblio.xml#"]',
		},
		{
			color: Colors.BrownLight,
			facet: {
				order: 70,
			},
			id: 'bio',
			type: EntityType.PagePart,
			filter: a =>
				a.name === 'ref' &&
				a.sourceProps.target?.slice(0, 8) === 'bio.xml#',
			getId: a => a.sourceProps.target.split('#')[1],
			getValue: props => props.annotation.sourceProps.target.split('#')[1],

			// extractId: el => el.getAttribute('target').split('#')[1],
			// extract: ({ entry, entityConfig }) =>
			// Array.from(entry.preparedElement.querySelectorAll(entityConfig.selector))
			// 	.map(x => ({
			// 		anchor: x,
			// 		content: x.textContent,
			// 	})),
			// selector: 'ref[target^="bio.xml#"]',
		},
		{
			color: Colors.Blue,
			id: 'editor',
			filter: a =>
				a.name === 'ptr' &&
				a.sourceProps.type === 'note' &&
				a.sourceProps.target?.length > 0
			,
			getId: a => a.sourceProps.target.split('#')[1],
			getValue: props => {
				const root = props.source.annotations.find(a => a.sourceProps['xml:id'] === props.annotation.props.entityId)
				return createPartialStandoffFromAnnotation(props.source, root)
			},

			// extractId: el => el.getAttribute('target')?.slice(1),
			// extract: ({ layerElement, entry, entityConfig }) =>
			// 	Array.from(layerElement.querySelectorAll(entityConfig.selector))
			// 		.map((ptr, index) => {
			// 			const id = ptr.getAttribute('docere:id')
			// 			const note = entry.preparedElement.querySelector(`note[*|id="${id}"]`)
			// 			const n = (index + 1).toString()
			// 			return {
			// 				anchor: ptr,
			// 				content: xmlToString(note),
			// 				n,
			// 				title: `Note ${n}`,
			// 			}
			// 		}),
			type: EntityType.Note,
			// selector: 'ptr[type="note"][target]',
			// showAsFacet: false
		}
	],

	facsimiles: {
		filter: a => a.name === 'pb' && a.sourceProps.facs != null && a.sourceProps.facs.length > 0,
		getId: a => a.sourceProps.facs.slice(1),
		getPath: (props) => {
			const { facsimileId: id } = props.annotation.props

			const surface = props.source.annotations.find(a => a.name === 'surface' && a.sourceProps['xml:id'] === id)
			if (surface == null) return null
			const graphic = props.source.annotations.find(a => a.name === 'graphic' && isChild(a, surface))
			if (graphic == null) return null
			if (graphic.sourceProps.url == null) return null

			return `/iiif/mondrian/SRA024000001/${graphic.sourceProps.url}.jpg/info.json`
		}
	},

	layers2: [
		{
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			id: 'original',
			findRoot: a => a.name === 'div' && a.sourceProps.type === 'original',
			type: LayerType.Text,
		},
		{
			id: 'translation',
			findRoot: a => a.name === 'div' && a.sourceProps.type === 'translation',
			type: LayerType.Text,
		}
	],

	pages: {
		config: [
			{
				id: 'biblio',
				split: {
					extractId: (el) => el.getAttribute('xml:id'),
					selector: 'bibl',
				},
				title: 'Bibliography'
			},
			{
				id: 'bio',
				split: {
					extractId: (el) => el.getAttribute('xml:id'),
					selector: 'person',
				},
				title: 'Biographies'
			},
		],
		getRemotePath: config => `mondrian/editie/apparaat/${config.id}.xml`
	},
	private: true,
	slug: 'mondrian',
	title: 'The Mondrian Papers',
})

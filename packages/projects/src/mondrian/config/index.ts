import { extendConfig, Colors, EntityType, LayerType } from '@docere/common'

export default extendConfig({
	metadata2: [
		// {
		// 	facet: {
		// 		datatype: EsDataType.Date,
		// 		interval: 'y',
		// 		order: 10,
		// 	},
		// 	// extract: entry => entry.document.querySelector('correspAction[type="sent"] > date')?.getAttribute('when'),
		// 	getValue: (_config, props) => {
		// 		const annotation = props.sourceTree.findChild(
		// 			a => a.name === 'correspAction' && a.metadata.type === 'sent',
		// 			a => a.name === 'date'
		// 		)
		// 		return annotation?.metadata.when
		// 	},
		// 	id: 'date',
		// },
		{
			facet: {
				order: 15,
			},
			getValue: (_config, props) =>
				props.id.slice(0, 7) === 'brieven' ? 'brief' : 'geschrift',
			id: 'type',
		},
		// {
		// 	facet: {
		// 		order: 20,
		// 	},
		// 	getValue: (_config, props) => {
		// 		const annotation = props.sourceTree.findChild(
		// 			a => a.name === 'correspAction' && a.metadata.type === 'sent',
		// 			a => a.name === 'name'
		// 		)
		// 		return props.sourceTree.getTextContent(annotation)
		// 	},
		// 	id: 'author',
		// },
		// {
		// 	facet: {
		// 		order: 30,
		// 	},
		// 	getValue: (_config, props) => {
		// 		const annotation = props.sourceTree.findChild(
		// 			a => a.name === 'correspAction' && a.metadata.type === 'received',
		// 			a => a.name === 'name'
		// 		)
		// 		return props.sourceTree.getTextContent(annotation)
		// 	},
		// 	id: 'addressee',
		// },
		// {
		// 	facet: {
		// 		order: 40,
		// 	},
		// 	getValue: (_config, props) => {
		// 		const annotation = props.sourceTree.findChild(
		// 			a => a.name === 'correspAction' && a.metadata.type === 'sent',
		// 			a => a.name === 'placeName'
		// 		)
		// 		return props.sourceTree.getTextContent(annotation)
		// 	},
		// 	id: 'place',
		// },
		// {
		// 	getValue: (_config, props) => {
		// 		const children = props.sourceTree.getChildren(
		// 			a => a.name === 'div' && a.metadata.type === 'notes',
		// 			a => a.name === 'note'
		// 		)
		// 		return children.length
		// 	},
		// 	id: 'noteCount',
		// },
		// {
		// 	getValue: (_config, props) => {
		// 		const children = props.sourceTree.getChildren(
		// 			a => a.name === 'div' && a.metadata.type === 'ogtnotes',
		// 			a => a.name === 'note'
		// 		)
		// 		return children.length
		// 	},
		// 	id: 'ogtNoteCount',
		// },
		// {
		// 	getValue: (_config, props) => {
		// 		const children = props.sourceTree.getChildren(
		// 			a => a.name === 'div' && a.metadata.type === 'typednotes',
		// 			a => a.name === 'note'
		// 		)
		// 		return children.length
		// 	},
		// 	id: 'typedNoteCount',
		// },
		// {
		// 	facet: {
		// 		datatype: EsDataType.Boolean,
		// 	},
		// 	getValue: (_config, props) => {
		// 		const annotation = props.sourceTree.find(a => a.name === 'div' && a.metadata.type === 'translation')
		// 		return props.sourceTree.getTextContent(annotation).trim().length > 0
		// 	},
		// 	id: 'hasTranslation',
		// }
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
				a.sourceProps.key?.length > 0,

			getId: a => a.sourceProps.key,
			id: 'rkd-artwork-link',
			title: 'Artwork',
			type: EntityType.Artwork,
		},
		{
			color: Colors.Blue,
			id: 'biblio',
			filter: a =>
				a.name === 'ref' &&
				a.sourceProps.target?.slice(0, 11) === 'biblio.xml#',
			// extract: ({ entityConfig, entry }) => Array.from(entry.preparedElement.querySelectorAll(entityConfig.selector))
			// 	.map(x => ({
			// 		anchor: x,
			// 		content: x.textContent,
			// 	})),
			facet: {
				order: 90,
			},
			getId: a => a.sourceProps.target.split('#')[1],
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
				a.sourceProps.target?.length > 0,

			getId: a => a.sourceProps.target.split('#')[1],

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
			// const { facsimileId: id } = props.annotation.props

			// const graphic = props.sourceTree.findChild(
			// 	a => a.name === 'surface' && a.metadata['xml:id'] === id,
			// 	a => a.name === 'graphic' && a.metadata.url?.length > 0
			// )
			// if (graphic == null) return


			// const { url } = graphic.metadata
			// const imgPath = url.slice(0, url.indexOf('_')) + '/' + url
			
			props
			let imgPath = 'unknown'
			return `/iiif/mondrian/${imgPath}.jpg/info.json`
		}
	},

	layers2: [
		{
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			id: 'original',
			// extractElement: extractLayerElement('div[type="original"]'),
			findRoot: a => a.name === 'div' && a.sourceProps.type === 'original',
			type: LayerType.Text,
		},
		{
			id: 'translation',
			// extractElement: extractLayerElement('div[type="translation"]'),
			findRoot: a => a.name === 'div' && a.sourceProps.type === 'translation',
			type: LayerType.Text,
		}
	],
	documents: {
		remoteDirectories: [
			'mondrian/editie-conversie/geschriften',
			'mondrian/editie-conversie/brieven/04_Transcriptie_DEF'
		],
		type: 'xml'
	},
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

import { extendConfig, LayerType } from '@docere/common'

export default extendConfig({
	documents: {
		type: 'xml'
	},

	entities2: [

	],

	facsimiles: {
		filter: a => {
			return a.name === 'graphic' && a.metadata.hasOwnProperty('url')
		},
		getId: a => a.metadata['xml:id'],
		getPath: a => {
			const fileName = a.metadata.url.replace(/^..\/images\//, '')
			if (!fileName.length) return null
			const imgPath = fileName.slice(0, fileName.indexOf('_')) + '/' + fileName
			return `/iiif/isidore/${imgPath}/info.json`
		}
	},

	layers2: [
		{
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			id: 'text',
			type: LayerType.Text,
		},
	],

	metadata2: [
		{
			facet: {},
			id: 'chapter',
			getValue: (_config, props) => {
				if (props.partConfig.id === 'chapter') {
					return props.root.metadata.n
				}

				if (props.partConfig.id === 'lemma') {
					const parent = props.sourceTree.findParent(
						a => a.name === 'div' && a.metadata.type === 'chapter',
						props.root
					)
					
					if (parent != null) return parent.metadata.n
				}

				if (props.partConfig.id === 'gloss') {
					const glossGroup = props.sourceTree.findParent(a => a.name === 'hi:glossGrp', props.root)

					const seg = props.sourceTree.annotations.find(a =>
						a.name === 'seg' && a.metadata['xml:id'] === glossGroup.metadata.target.slice(1)
					)

					const parent = props.sourceTree.findParent(
						a => a.name === 'div' && a.metadata.type === 'chapter',
						seg
					)
					
					if (parent != null) return parent.metadata.n
				}
			}
		},
		{
			facet: {},
			id: 'unit',
			getValue: (_config, props) => props.partConfig.id,
		},
		{
			facet: {},
			id: 'gloss_sim',
			getValue: (_config, props) => {
				if (props.partConfig.id === 'gloss') {
					return props.root.metadata.sim
				}
			},
		},
		{
			facet: {},
			id: 'gloss_weight',
			getValue: (_config, props) => {
				if (props.partConfig.id === 'gloss') {
					return props.root.metadata.weight
				}
			},
		},
		{
			facet: {},
			id: 'gloss_manuscript',
			getValue: (_config, props) => {
				if (props.partConfig.id === 'gloss') {
					return props.root.metadata.corresp
				}
			},
		},
		{
			facet: {},
			id: 'gloss_hand',
			getValue: (_config, props) => {
				if (props.partConfig.id === 'gloss') {
					return props.root.metadata.hand
				}
			},
		}
	],

	parts: [
		{
			id: 'chapter',
			filter: a => a.name === 'div' && a.metadata.type === 'chapter',
			getId: a => a.id
		},
		{
			id: 'gloss',
			filter: a => a.name === 'gloss',
			getId: a => a.id
		},
		{
			id: 'lemma',
			filter: a => a.name === 'seg' && a.metadata.hasOwnProperty('xml:id'),
			getId: a => a.metadata['xml:id']
		}
	],

	private: true,

	slug: 'isidore',

	title: "Isidore's Ethymologiae",
})


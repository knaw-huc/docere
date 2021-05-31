import { extendConfig, LayerType, Colors, EntityType, EsDataType } from '@docere/common'
import { hasMetadataValue } from '../../utils'
// import { createFacsimiles } from './facsimiles'

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
		// {
		// 	id: 'summary',
		// 	extract: entry => entry.preparedElement.querySelector('div[type="summary"] > p').textContent
		// },
		{
			facet: {
				description: 'Dit is een test om wat te zien',
			},
			id: 'sender',
			getValue: (_config, props) => {
				const annotation = props.tree.findChild(
					a => a.name === 'correspAction' && a.metadata.type === 'sent',
					a => a.name === 'name'
				)
				return props.tree.getTextContent(annotation)
			}
			// extract: entry => entry.preparedElement.querySelector('correspAction[type="sent"] name').textContent
		},
		{
			facet: {},
			id: 'sender_place',
			getValue: (_config, props) => {
				const annotation = props.tree.findChild(
					a => a.name === 'correspAction' && a.metadata.type === 'sent',
					a => a.name === 'settlement'
				)
				return props.tree.getTextContent(annotation)
			}
			// extract: entry => entry.preparedElement.querySelector('correspAction[type="sent"] settlement').textContent
		},
		{
			facet: {
				datatype: EsDataType.Date,
				interval: 'y',
			},
			getValue: (_config, props) => {
				const annotation = props.tree.findChild(
					a => a.name === 'correspAction' && a.metadata.type === 'sent',
					a => a.name === 'date'
				)
				return annotation.metadata.when.trim()
			},
			// extract: entry => entry.preparedElement.querySelector('correspAction[type="sent"] date')?.getAttribute('when'),
			id: 'sender_date',
		},
		{
			facet: {},
			getValue: (_config, props) => {
				const annotation = props.tree.annotations.find(
					a => a.name === 'idno' && a.metadata.type === 'filza'
				)
				return props.tree.getTextContent(annotation)
			},
			id: 'filza',
			// extract: entry => entry.preparedElement.querySelector('idno[type="filza"]').textContent
		},
		{
			facet: {},
			getValue: (_config, props) => {
				const annotation = props.tree.annotations.find(
					a => a.name === 'idno' && a.metadata.type === 'letterno'
				)
				return props.tree.getTextContent(annotation)
			},
			id: 'letterno',
			// extract: entry => entry.preparedElement.querySelector('idno[type="letterno"]').textContent
		},
		{
			facet: {},
			id: 'settlement',
			getValue: (_config, props) => {
				const annotation = props.tree.findChild(
					a => a.name === 'msIdentifier',
					a => a.name === 'settlement'
				)
				return props.tree.getTextContent(annotation)
			},
			// extract: entry => entry.preparedElement.querySelector('msIdentifier > settlement').textContent
		},
		{
			facet: {},
			id: 'insitution',
			getValue: (_config, props) => {
				const annotation = props.tree.findChild(
					a => a.name === 'msIdentifier',
					a => a.name === 'institution'
				)
				return props.tree.getTextContent(annotation)
			},
			// extract: entry => entry.preparedElement.querySelector('msIdentifier > institution').textContent
		},
		{
			facet: {},
			id: 'collection',
			getValue: (_config, props) => {
				const annotation = props.tree.findChild(
					a => a.name === 'msIdentifier',
					a => a.name === 'collection'
				)
				return props.tree.getTextContent(annotation)
			},
			// extract: entry => entry.preparedElement.querySelector('msIdentifier > collection').textContent
		},
		{
			facet: {},
			getValue: (_config, props) => {
				const annotation = props.tree.annotations.find(
					a => a.name === 'biblScope'
				)
				return props.tree.getTextContent(annotation)
			},
			id: 'biblScope',

			// extract: entry => entry.preparedElement.querySelector('biblScope').textContent
		},
		{
			getValue: (_config, props) => {
				const annotation = props.tree.annotations.find(
					a => a.name === 'div' && a.metadata.type === 'summary'
				)
				return props.tree.getTextContent(annotation)
			},
			id: 'summary',
			// extract: entry => entry.preparedElement.querySelector('div[type="summary"]')?.textContent,
			// showAsFacet: false
		}
	],
	entities2: [
		{
			color: Colors.BlueBright,
			id: 'note',
			filter: a => a.name === 'ptr' && hasMetadataValue(a, 'target'),
			getId: a => a.metadata.target.slice(1),
			// extract: ({ layerElement, entityConfig, entry }) => Array.from(layerElement.querySelectorAll(entityConfig.selector))
			// 	.map(el => {
			// 		const n = el.getAttribute('n')
			// 		const id = entityConfig.extractId(el)
			// 		return {
			// 			anchor: el,
			// 			content: xmlToString(entry.preparedElement.querySelector(`note[*|id="${id}"]`)),
			// 			n,
			// 			title: `Note ${n}`,
			// 		}
			// 	}),
			// extractId: el => el.getAttribute('target').slice(1),
			// selector: 'ptr[target]',
			title: "Notes",
			type: EntityType.Note,
			showInAside: false,
			// showAsFacet: false,
		},
		{
			color: Colors.Pink,
			id: 'personography',
			filter: a => a.name === 'rs' && a.metadata.type === 'pers',
			getId: a => a.metadata.key,
			// extract: ({ layerElement, entityConfig }) => Array.from(layerElement.querySelectorAll(entityConfig.selector))
			// 	.map(el => ({
			// 		anchor: el,
			// 		content: el.getAttribute('key'),
			// 	})),
			// extractId: el => el.getAttribute('key'),
			// selector: 'rs[type="pers"]',
			title: "Persons",
			type: EntityType.Person,
		},
	],
	// facsimiles: {
	// 	extractFacsimileId: el => el.getAttribute('xml:id'),
	// 	extractFacsimiles,
	// 	selector: 'pb',
	// },
	// createFacsimiles,

	facsimiles: {
		filter: a => a.name === 'pb',
		getId: a => a.metadata['xml:id'],
		getPath: a => {
			const { _facsimileId: id } = a.metadata

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
			// extractElement: entry => entry.preparedElement.querySelector('div[type="original"]'),
			findRoot: a => a.name === 'div' && a.metadata.type === 'original',
			id: 'text',
			type: LayerType.Text,
		},
		{
			// extractElement: entry => entry.preparedElement.querySelector('div[type="summary"]'),
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

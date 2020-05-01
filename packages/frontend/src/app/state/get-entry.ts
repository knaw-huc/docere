import { LayerType, defaultMetadata } from '@docere/common'

import { fetchEntryXml, isTextLayer, isXmlLayer } from '../../utils'

import type { FacsimileArea, Facsimile, LayerConfig, TextLayerConfig, Layer, DocereConfigData, Entry } from '@docere/common'

const defaultFacsimileArea: Pick<FacsimileArea, 'showOnHover' | 'target' | 'unit'> = {
	showOnHover: true,
	target: null,
	unit: 'px'
}

function extendFacsimile(facsimile: Facsimile) {
	facsimile.versions = facsimile.versions.map(version => {
		if (!Array.isArray(version.areas)) {
			version.areas = []
			return version
		}

		version.areas = version.areas.map(area => ({ ...defaultFacsimileArea, ...area }))	

		return version
	})

	return facsimile
}

const defaultLayerConfig: LayerConfig = {
	active: true,
	id: null,
}

const defaultTextLayerConfig: TextLayerConfig = {
	...defaultLayerConfig,
	type: LayerType.Text
}

function extendLayer(extractedLayer: Layer, layersConfig: LayerConfig[]): Layer {
	let layerConfig: LayerConfig = layersConfig.find(tlc => tlc.id === extractedLayer.id) || { id: null }
	const dlc = layerConfig.type === LayerType.Text || layerConfig.type == null ? defaultTextLayerConfig : defaultLayerConfig
	return { title: extractedLayer.id, ...dlc, ...layerConfig, ...extractedLayer }
}

async function extractLayers(doc: XMLDocument, configData: DocereConfigData) {
	// Extract layers with the layers extraction function
	const layers = configData.extractLayers(doc, configData.config)
	const extractedLayerIds = layers.map(l => l.id)

	return configData.config.layers
		// Keep the layers that are not found by the extraction function, but are defined in the config
		.filter(tl => extractedLayerIds.indexOf(tl.id) === -1)
		// Concat the extracted layers with the layers not found by extract layers, but defined in the config
		.concat(layers)
		// Extend all layers with the defaults
		.map(tl => extendLayer(tl, configData.config.layers))
		// Add the whole document as `element` (extracted layers already have the `element` prop defined)
		.map((layer: Layer) => {
			if ((isTextLayer(layer) || isXmlLayer(layer)) && layer.element == null) layer.element = doc
			return layer
		})
}

function extractMetadata(doc: XMLDocument, configData: DocereConfigData, entryId: string): Entry['metadata'] {
	const extractedMetadata = configData.extractMetadata(doc, configData.config, entryId)

	return Object.keys(extractedMetadata)
		.map(id => {
			const data = configData.config.metadata.find(md => md.id === id)
			return (data == null) ?
				{ ...defaultMetadata, title: id } :
				data
		})
		.filter(data => data.showInAside)
		.sort((data1, data2) => data1.order - data2.order)
		.map(x => {
			return {
				...x,
				value: extractedMetadata[x.id]
			} 
		})
		// .reduce((prev, curr, index, array) => {
		// 	// if (isHierarchyFacetConfig(curr)) {
		// 	// 	if (!/0$/.test(curr.id)) return prev
		// 	// 	const hierarchyFacetId
		// 	// 	curr.value = 
		// 	// }
		// 	// TODO merge hierarchy facets
		// 	return prev
		// }, [] as Entry['metadata'])
}

export default async function getEntry(id: string, configData: DocereConfigData): Promise<Entry> {
	// Fetch and prepare XML document
	let doc = await fetchEntryXml(configData.config.slug, id)
	doc = configData.prepareDocument(doc, configData.config, id)

	// Extract data
	const entities = configData.extractEntities(doc, configData.config)
	const facsimiles = configData.extractFacsimiles(doc, configData.config, id).map(extendFacsimile)
	const layers = await extractLayers(doc, configData)
	const notes = configData.extractNotes(doc, configData.config)
	const metadata = extractMetadata(doc, configData, id)

	return {
		doc,
		entities: entities.length ? entities : null,
		facsimiles: facsimiles.length ? facsimiles : null,
		id,
		layers,
		metadata,
		notes: notes.length ? notes : null, // Empty array should be null to prevent rerenders
	}
}

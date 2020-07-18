import React from 'react'
import { FacsimileArea, Facsimile, LayerConfig, TextLayerConfig, LayerType, DocereConfigData, Entry, defaultMetadata, MetadataItem, EsDataType, fetchEntryXml, ProjectContext, TextData } from '..'
import { Note, Layer } from '../types'
import { isTextLayer } from '../utils'

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
	pinned: false,
	id: null,
}

const defaultTextLayerConfig: TextLayerConfig = {
	...defaultLayerConfig,
	extract: doc => doc,
	type: LayerType.Text
}

// function extendLayer(extractedLayer: Layer, layersConfig: LayerConfig[]): Layer {
// 	const layerConfig: LayerConfig = layersConfig.find(tlc => tlc.id === extractedLayer.id) || defaultLayerConfig
// 	const dlc = layerConfig.type === LayerType.Text || layerConfig.type == null ? defaultTextLayerConfig : defaultLayerConfig
// 	return setTitle({ ...dlc, ...layerConfig, ...extractedLayer })
// }

// async function extractLayers(doc: XMLDocument, configData: DocereConfigData, hasFacsimiles: boolean) {
// 	// Extract layers with the layers extraction function
// 	const extractedLayers = configData.extractLayers(doc, configData.config)
// 	const extractedLayerIds = extractedLayers.map(l => l.id)

// 	const layers = configData.config.layers
// 		// Keep the layers that are not found by the extraction function, but are defined in the config
// 		.filter(tl => extractedLayerIds.indexOf(tl.id) === -1)
// 		// Concat the extracted layers with the layers not found by extract layers, but defined in the config
// 		.concat(extractedLayers)
// 		// Extend all layers with the defaults
// 		.map(tl => extendLayer(tl, configData.config.layers))

// 	// If facsimiles are extracted, but there is no facsimile layer, add one
// 	if (hasFacsimiles && !layers.some(l => l.type === LayerType.Facsimile)) {
// 		layers.unshift(extendLayer({
// 			...defaultLayerConfig,
// 			id: 'scan',
// 			type: LayerType.Facsimile
// 		}, []))
// 	}

// 	// If no layers are found, add a default text layer with the whole document to visualize
// 	if (!layers.length) {
// 		return [ { ...defaultTextLayerConfig, element: doc } ]
	
// 	// If there is only 1 layer and it doesn't have an element, add the whole document to visualize
// 	} else if (
// 		layers.length === 1 &&
// 		((isTextLayer(layers[0]) || isXmlLayer(layers[0])) && layers[0].element == null)
// 	) {
// 		layers[0].element = doc
// 	}

// 	return layers
// }

function extractMetadata(doc: XMLDocument, configData: DocereConfigData, entryId: string): Entry['metadata'] {
	const extractedMetadata = configData.extractMetadata(doc, configData.config, entryId)
	const extractedMetadataKeys = Object.keys(extractedMetadata)

	return extractedMetadataKeys
		// Remove sub levels of hierarchy facet, their values will be added to the hierarchy metadata later
		.filter(field => !/level\d+$/.test(field))

		// Map extracted IDs to configured metadata
		.map(id => {
			const config = configData.config.metadata.find(md => md.id === id)
			return (config == null) ?
				{ ...defaultMetadata, id, title: id, value: extractedMetadata[id] } :
				config
		})


		// Remove metadata which are configured to not be shown in the aside
		.filter(config => config.showInAside)

		// Add value to the config to create a MetadataItem
		.map(config => ({
			...config,
			value: extractedMetadata[config.id]
		} as MetadataItem))

		// Add hierarchy facet metadata
		.concat(
			configData.config.metadata
				.filter(md => md.datatype === EsDataType.Hierarchy)
				.map(md => {
					return {
						...md,
						value: extractedMetadataKeys
							.filter(key => new RegExp(`^${md.id}_level`).test(key))
							.sort((key1, key2) => {
								const number1 = parseInt(key1.match(/\d+$/)[0], 10)
								const number2 = parseInt(key2.match(/\d+$/)[0], 10)
								return number1 - number2
							})
							.map(key => extractedMetadata[key] as string)
					} as MetadataItem
				})
		)

		// Sort metadata config by order
		.sort((config1, config2) => config1.order - config2.order)
}

function addCount(prev: Map<string, TextData | Note>, curr: TextData) {
	if (prev.has(curr.id)) prev.get(curr.id).count += 1
	else prev.set(curr.id, { ...curr, count: 1 })
	return prev
}

const entryCache = new Map<string, Entry>()

async function getEntry(id: string, configData: DocereConfigData): Promise<Entry> {
	// Fetch and prepare XML document
	let doc = await fetchEntryXml(configData.config.slug, id)
	doc = configData.prepareDocument(doc, configData.config, id)

	// Extract data
	const facsimiles = configData.extractFacsimiles(doc, configData.config, id).map(extendFacsimile)
	// const layers = await extractLayers(doc, configData, facsimiles.length > 0)

	const layers: Layer[] = configData.config.layers
		.map(layer => {
			let _layer: Layer

			if (isTextLayer(layer)) {
				_layer = {
					...defaultTextLayerConfig,
					...layer,
					element: layer.extract(doc, configData.config)
				}	
			} else {
				_layer = {
					...defaultLayerConfig,
					...layer,
					type: LayerType.Facsimile
				}
			}

			return _layer
		})
	// const entities = configData.extractEntities(doc, configData.config)

	const entities: Map<string, TextData> = configData.config.entities
		.reduce((prev, curr) => {
			const extracted = curr.extract(doc, layers, configData.config)
				.map(x => ({ ...x, config: curr }))
			return prev.concat(extracted)
		}, [])
		.reduce(addCount, new Map<string, TextData>())

	const notes: Map<string, Note> = configData.config.notes
		.reduce((prev, curr) => {
			const extracted = curr.extract(doc, layers, configData.config)
				.map(x => ({ ...x, config: curr }))
			return prev.concat(extracted)
		}, [])
		.reduce(addCount, new Map<string, Note>())

	const metadata = extractMetadata(doc, configData, id)

	entryCache.set(id, {
		doc,
		entities: entities.size ? Array.from(entities.values()) : null,
		facsimiles: facsimiles.length ? facsimiles : null,
		id,
		layers,
		metadata,
		notes: notes.size ? Array.from(notes.values()) : null, // Empty array should be null to prevent rerenders
	})

	return entryCache.get(id)
}

export default function useEntry(id: string) {
	const projectContext = React.useContext(ProjectContext)
	const [entry, setEntry] = React.useState<Entry>(null)

	React.useEffect(() => {
		if (id == null || projectContext == null) return

		if (entryCache.has(id)) {
			setEntry(entryCache.get(id))
		} else {
			getEntry(id, projectContext.configData).then(setEntry)
		}

	}, [id])

	return entry
}

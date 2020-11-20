import { extractEntry, ExtractEntry, GetDefaultExtractedEntry, XmlToString, getDefaultExtractedEntry } from '@docere/common'
import { xmlToString, serializeEntry, SerializeEntry } from '@docere/common'

export { getDefaultExtractedEntry, xmlToString, serializeEntry, extractEntry }
export type { ExtractEntry, GetDefaultExtractedEntry, SerializeEntry, XmlToString }

// const defaultFacsimileArea: Pick<FacsimileArea, 'showOnHover' | 'target' | 'unit'> = {
// 	showOnHover: true,
// 	target: null,
// 	unit: 'px'
// }

// function addCount(prev: Map<string, Entity>, curr: Entity) {
// 	if (prev.has(curr.id)) prev.get(curr.id).count += 1
// 	else prev.set(curr.id, { ...curr, count: 1 })
// 	return prev
// }


// function extractFacsimiles(layer: ExtractedLayer, entry: ConfigEntry, config: DocereConfig) {
// 	return config.facsimiles?.extract(entry, config)
// 		.filter(x => x != null)
// 		.map(extendFacsimile)
// }

// function extractLayers(entry: ConfigEntry, parent: ConfigEntry, config: DocereConfig): SerializedLayer[] {
// 	return config.layers.map(serializeLayer(entry, parent, config))
// }

// function extractEntities(el: Element, layer: TextLayerConfig, entry: ConfigEntry, config: DocereConfig) {
// 	const entities: Map<string, Entity> = config.entities
// 		.reduce((prev, curr) => {
// 			const entities = curr.extract(el, layer, entry, config).map(toEntity(curr))
// 			return prev.concat(entities)
// 		}, [] as Entity[])
// 		.reduce(addCount, new Map<string, Entity>())

// 	return Array.from(entities.values())
// }



// function extractMetadata(entry: Entry, config: DocereConfig): Entry['metadata'] {
// 	const extractedMetadata = configData.extractMetadata(entry, configData.config)
// 	const extractedMetadataKeys = Object.keys(extractedMetadata)

// 	return extractedMetadataKeys
// 		// Remove sub levels of hierarchy facet, their values will be added to the hierarchy metadata later
// 		.filter(field => !/level\d+$/.test(field))

// 		// Map extracted IDs to configured metadata
// 		.map(id => {
// 			const config = configData.config.metadata.find(md => md.id === id)
// 			return (config == null) ?
// 				{ ...defaultMetadata, id, title: id, value: extractedMetadata[id] } :
// 				config
// 		})


// 		// Remove metadata which are configured to not be shown in the aside
// 		.filter(config => config.showInAside)

// 		// Add value to the config to create a MetadataItem
// 		.map(config => ({
// 			...config,
// 			value: extractedMetadata[config.id]
// 		} as MetadataItem))

// 		// Add hierarchy facet metadata
// 		.concat(
// 			configData.config.metadata
// 				.filter(md => md.datatype === EsDataType.Hierarchy)
// 				.map(md => {
// 					return {
// 						...md,
// 						value: extractedMetadataKeys
// 							.filter(key => new RegExp(`^${md.id}_level`).test(key))
// 							.sort((key1, key2) => {
// 								const number1 = parseInt(key1.match(/\d+$/)[0], 10)
// 								const number2 = parseInt(key2.match(/\d+$/)[0], 10)
// 								return number1 - number2
// 							})
// 							.map(key => extractedMetadata[key] as string)
// 					} as MetadataItem
// 				})
// 		)

// 		// Sort metadata config by order
// 		.sort((config1, config2) => config1.order - config2.order)
// }

// const defaultLayerConfig: LayerConfig = {
// 	active: true,
// 	pinned: false,
// 	id: null,
// }

// const defaultTextLayerConfig: TextLayerConfig = {
// 	...defaultLayerConfig,
// 	extract: entry => entry.element,
// 	type: LayerType.Text,
// 	filterEntities: () => () => false,
// 	filterFacsimiles: () => () => false,
// 	filterNotes: () => () => false,
// }

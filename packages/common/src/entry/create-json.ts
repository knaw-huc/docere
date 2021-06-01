import { DocereConfig, StandoffTree } from '..'
import { isTextLayerConfig } from '../utils'
import { FacsimileLayer, ID, isEntityMetadataConfig, JsonEntry, TextLayer } from '.'

export type CreateJsonEntryProps = {
	config: DocereConfig
	id: ID
	tree: StandoffTree
}

/**
 * Create JSON entry to store in the database and send over the wire. 
 * 
 * @param props 
 * @returns 
 */
export function createJsonEntry(props: CreateJsonEntryProps): JsonEntry {
	// const facsimiles = props.config.createFacsimiles(props)

	// console.log(props.tree)

	return {
		id: props.id,

		layers: props.config.layers2
			.map(layerConfig => {
				if (isTextLayerConfig(layerConfig)) {
					let tree = props.tree
					if (layerConfig.findRoot != null) {
						tree = props.tree.createStandoffTreeFromAnnotation(layerConfig.findRoot)
						if (tree == null) return null
					}
					return {
						...layerConfig,
						tree: tree.exportReactTree()
					} as TextLayer
				} 

				return layerConfig as FacsimileLayer
			})
			.filter(x => x != null),

		metadata: props.config.metadata2.map(metadataConfig => {
			let value

			if (isEntityMetadataConfig(metadataConfig)) {
				const entityConfig = props.config.entities2.find(ec => ec.id === metadataConfig.entityConfigId)
				value = props.tree.annotations
					.filter(entityConfig.filter)
					.filter(metadataConfig.filterEntities)
					.map(a => entityConfig.getValue(a, props))
			} else {
				value = metadataConfig.getValue(metadataConfig, props)
			}

			return {
				config: metadataConfig,
				value,
			}
		}),
		// textData: {
			// facsimiles: facsimiles.reduce(toSerializedMap, []),
		// }
	}
}

// function toSerializedMap<T extends StandoffAnnotation & ExtractedFacsimile>(prev: [ID, T][], curr: T) {
// 	prev.push([curr.id, curr])
// 	return prev
// }

// export type GetDefaultExtractedEntry = (id: string) => ExtractedEntry
// export function getDefaultExtractedEntry(id: string): ExtractedEntry {
// 	return {
// 		document: null,
// 		preparedElement: null,
// 		entities: null,
// 		facsimiles: null,
// 		id,
// 		layers: null,
// 		metadata: null,
// 		parts: null,
// 	}
// }

// function extractMetadata(entry: ExtractedEntry, config: DocereConfig): ExtractedEntry['metadata'] {
// 	return config.metadata
// 		.map(md => ({
// 			...md,
// 			value: md.extract(entry, config)
// 		}) as MetadataItem)
//  		.sort((config1, config2) => config1.order - config2.order)
// }

// /**
//  * Extract entities
//  * 
//  * - Entities are extracted from text layers.
//  * - The layer ID and the entity config ID are stored on the entity for later reference
//  * - Values set in the config are transferred to the entity
//  * - Every entity gets a docere:id and docere:type in order render the entity anywhere in the edition. 
//  * 
//  * @param layerElement 
//  * @param layer 
//  * @param entry 
//  * @param config 
//  * @return {@link ExtractedEntity}[]
//  */
// function extractEntities(layerElement: Element, layer: TextLayerConfig, entry: ExtractedEntry, config: DocereConfig) {
// 	if (layerElement == null) return []

// 	return config.entities
// 		.reduce((prev, entityConfig) => {
// 			const entities: ExtractedEntity[] = entityConfig
// 				.extract({ config, entityConfig, entry, layer, layerElement })
// 				.map(e => {
// 					if (Array.isArray(e.facsimileAreas)) {
// 						e.facsimileAreas = e.facsimileAreas.map(fa => {
// 							if (isFacsimileAreaRectangle(fa)) {
// 								fa.unit = fa.unit || 'px'
// 							}
// 							fa.id = generateId()
// 							return fa
// 						})
// 					}
// 					e.id = e.anchor.getAttribute('docere:id')
// 					e.attributes = {}
// 					for (const attr of e.anchor.attributes) {
// 						e.attributes[attr.name] = attr.value
// 					}
// 					return e
// 				})
// 				.filter(x => x != null && x.id != null)
// 				.map(e => {
// 					const { extract, extractId, selector, id, ...configRest } = entityConfig
// 					const fullEntity: ExtractedEntity = {
// 						configId: entityConfig.id,
// 						layerId: layer.id,
// 						...configRest,
// 						...e,
// 					}
// 					return fullEntity
// 				})
// 			return prev.concat(entities)
// 		}, [] as ExtractedEntity[])
// 		// .map(addDocereId)
// }

// function extractFacsimiles(layerElement: Element, layer: TextLayerConfig, entry: ExtractedEntry, config: DocereConfig) {
// 	if (layerElement == null) return []

// 	return config.facsimiles
// 		.extractFacsimiles({ layerElement, layer, entry, config })	
// 		.filter(x => x != null && x.id != null)
// 		.map(facsimile => {
// 			facsimile.layerId = layer.id

// 			facsimile.versions = facsimile.versions.map(version => {
// 				if (version.type == null) version.type = FacsimileType.IIIF
// 				return version
// 			})

// 			return facsimile
// 		})
// }

// export function extractEntryData(entry: ExtractedEntry, config: DocereConfig) {
// 	entry.metadata = extractMetadata(entry, config)

// 	entry.layers = config.layers.reduce((prev, layer) => {
// 		if (isTextLayerConfig(layer)) {
// 			let el = entry.preparedElement
// 			if (layer.extractElement != null) {
// 				el = layer.extractElement(entry, config)
// 			}

// 			const facsimiles = extractFacsimiles(el, layer, entry, config)
// 			const entities = extractEntities(el, layer, entry, config)

// 			prev.push({ ...layer, el, facsimiles, entities })
// 		} else {
// 			prev.push({ ...layer, facsimiles: [], entities: [] })
// 		}
// 		return prev
// 	}, [] as (ExtractedLayer)[])

// 	entry.facsimiles = entry.layers.reduce(
// 		(prev, layer) =>
// 			isTextLayerConfig(layer) ?
// 				prev.concat(layer.facsimiles) :
// 				prev,
// 		[]
// 	)

// 	entry.facsimiles = Array.from(entry.layers
// 		.reduce(
// 			(prev, curr) => {
// 				curr.facsimiles.forEach(f => prev.set(f.id, f))
// 				return prev
// 			},
// 			new Map()	
// 		)
// 		.values())

// 	const facsimileLayer = entry.layers.find(l => l.type === LayerType.Facsimile)
// 	if (facsimileLayer != null) facsimileLayer.facsimiles = entry.facsimiles

// 	entry.entities = entry.layers.reduce(
// 		(prev, layer) =>
// 			isTextLayerConfig(layer) ?
// 				prev.concat(layer.entities) :
// 				prev,
// 		[]
// 	)

// 	// Extraction of layers depends on entry.facsimiles, entry.entities and entry.notes
// 	// entry.layers = extractLayers(entry, entry, config)
// }

// export function extractParts(entry: ExtractedEntry, config: DocereConfig) {
// 	if (config.parts == null) return

// 	entry.parts = new Map()
// 	for (const [partId, partEl] of config.parts.extract(entry, config)) {
// 		const part = extractPart({
// 			config,
// 			document: entry.document,
// 			preparedElement: partEl,
// 			id: partId,
// 			parent: entry,
// 		})

// 		entry.parts.set(partId, part)
// 	}
// }

// export interface ExtractPartProps extends ExtractEntryProps {
// 	parent: ExtractedEntry
// }
// function extractPart(props: ExtractPartProps) {
// 	const entry = getDefaultExtractedEntry(props.id)

// 	entry.parent = props.parent
// 	entry.metadata = extractMetadata(entry, props.config)

// 	entry.document = props.document
// 	entry.preparedElement =  props.preparedElement

// 	// entry.layers = extractLayers(entry, props.parent, props.config)
// 	extractEntryData(entry, props.config)

// 	return entry
// }

// export interface ExtractEntryProps {
// 	config: DocereConfig
// 	document: XMLDocument
// 	id: ID
// 	preparedElement: Element
// }
// export type ExtractEntry = (props: ExtractEntryProps) => ExtractedEntry
// export function extractEntry(props: ExtractEntryProps) {
// 	const entry = getDefaultExtractedEntry(props.id)
// 	entry.document = props.document
// 	entry.preparedElement =  props.preparedElement
// 	extractEntryData(entry, props.config)
// 	extractParts(entry, props.config)
// 	return entry
// }

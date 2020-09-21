import { Entry, MetadataItem, GetEntryProps, GetPartProps } from './types/entry'
import { FacsimileArea, Facsimile, LayerConfig, TextLayerConfig, LayerType, TextData, Note, defaultMetadata, DocereConfig, Layer, TextLayer } from '.'
import { isFacsimileLayerConfig, isTextLayerConfig } from './utils'
import { FacsimileLayer } from './types'

export function getDefaultEntry(id: string): Entry {
	return {
		document: null,
		element: null,
		entities: null,
		facsimiles: null,
		id,
		layers: null,
		metadata: null,
		notes: null,
		parts: null,
		parentId: null,
	}
}

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
	extract: entry => entry.element,
	type: LayerType.Text
}


function addCount(prev: Map<string, TextData | Note>, curr: TextData) {
	if (prev.has(curr.id)) prev.get(curr.id).count += 1
	else prev.set(curr.id, { ...curr, count: 1 })
	return prev
}

function extractMetadata(entry: Entry, config: DocereConfig): Entry['metadata'] {
	return config.metadata
		.map(md => ({
			...defaultMetadata,
			title: md.id,
			value: md.extract(entry, config)
		}) as MetadataItem)
 		.sort((config1, config2) => config1.order - config2.order)
}

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

function extractLayers(entry: Entry, parent: Entry, config: DocereConfig): Layer[] {
	return config.layers
		.map(layer => {
			const filtered = {
				entities: layer.filterEntities != null ? parent.entities?.filter(layer.filterEntities(entry)) : parent.entities,
				facsimiles: layer.filterFacsimiles != null ? parent.facsimiles?.filter(layer.filterFacsimiles(entry)) : parent.facsimiles,
				notes: layer.filterNotes != null ? parent.notes?.filter(layer.filterNotes(entry)) : parent.notes,
			}

			if (isTextLayerConfig(layer)) {
				const tl: TextLayer = {
					...defaultTextLayerConfig,
					...layer,
					...filtered,
					element: layer.extract(entry, config),
				}
				return tl
			} else if (isFacsimileLayerConfig(layer)) {
				const fl: FacsimileLayer = {
					...defaultLayerConfig,
					...layer,
					...filtered,
					type: LayerType.Facsimile,
				}
				return fl
			} else {
				throw Error('Unknown layer type')
			}
		})
}

function extractEntities(entry: Entry, config: DocereConfig) {
	const entities: Map<string, TextData> = config.entities
		.reduce((prev, curr) => {
			const extracted = curr.extract(entry, config)
				.map(x => ({ ...x, config: curr }))
			return prev.concat(extracted)
		}, [])
		.reduce(addCount, new Map<string, TextData>())

	return Array.from(entities.values())
}

function extractNotes(entry: Entry, config: DocereConfig) {
	const notes: Map<string, Note> = config.notes
		.reduce((prev, curr) => {
			const extracted = curr.extract(entry, config)
				.map(x => ({ ...x, config: curr }))
			return prev.concat(extracted)
		}, [])
		.reduce(addCount, new Map<string, Note>())

	return Array.from(notes.values())
}

export function extractEntryData(entry: Entry, config: DocereConfig) {
	entry.metadata = extractMetadata(entry, config)

	entry.facsimiles = config.facsimiles.extract(entry, config).map(extendFacsimile)
	entry.entities = extractEntities(entry, config)
	entry.notes = extractNotes(entry, config)

	// Extraction of layers depends on entry.facsimiles, entry.entities and entry.notes
	entry.layers = extractLayers(entry, entry, config)
}

export function extractParts(entry: Entry, config: DocereConfig) {
	if (config.parts == null) return

	entry.parts = new Map()
	for (const [partId, partEl] of config.parts.extract(entry, config)) {
		const part = getPartSync({
			config,
			document: entry.document,
			element: partEl,
			id: partId,
			parent: entry,
		})

		entry.parts.set(partId, part)
	}
}

function getPartSync(props: GetPartProps) {
	const entry = getDefaultEntry(props.id)
	entry.parentId = props.parent.id

	entry.document = props.document
	entry.element =  props.element

	entry.metadata = props.parent.metadata

	entry.facsimiles = props.config.facsimiles.extract(entry, props.config).map(extendFacsimile)
	entry.entities = extractEntities(entry, props.config)
	entry.notes = extractNotes(entry, props.config)

	entry.layers = extractLayers(entry, props.parent, props.config)

	return entry
}

export function getEntrySync(props: GetEntryProps) {
	const entry = getDefaultEntry(props.id)
	entry.document = props.document
	entry.element =  props.element
	extractEntryData(entry, props.config)
	extractParts(entry, props.config)
	return entry
}

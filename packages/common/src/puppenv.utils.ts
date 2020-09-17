import { Entry, MetadataItem, GetEntryProps, GetPartProps } from './types/entry'
import { FacsimileArea, Facsimile, LayerConfig, TextLayerConfig, LayerType, TextData, Note, defaultMetadata, DocereConfig, Layer, isTextLayer } from '.'
import { isFacsimileLayer } from './utils'

export function getDefaultEntry(id: string): Entry {
	return {
		document: null,
		element: null,
		entities: null,
		// facsimiles: null,
		id,
		layers: null,
		metadata: null,
		notes: null,
		parts: null,
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

function extractLayers(entry: Entry, config: DocereConfig) {
	return config.layers
		.map(layer => {
			let _layer: Layer

			if (isTextLayer(layer)) {
				_layer = {
					...defaultTextLayerConfig,
					...layer,
					element: layer.extract(entry, config)
				}	
			} else if (isFacsimileLayer(layer)) {
				_layer = {
					...defaultLayerConfig,
					...layer,
					type: LayerType.Facsimile,
					facsimiles: layer.extract(entry, config).map(extendFacsimile)
				}
			} else {
				throw Error('Unknown layer type')
			}

			return _layer
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
	entry.layers = extractLayers(entry, config)
	// entry.facsimiles = config.extractFacsimiles(entry, config).map(extendFacsimile)
	entry.entities = extractEntities(entry, config)
	entry.notes = extractNotes(entry, config)
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
	entry.document = props.document
	entry.element =  props.element

	entry.metadata = props.parent.metadata
	entry.layers = extractLayers(entry, props.config)

	if (props.config.parts.filterEntities != null) {
		entry.entities = props.parent.entities.filter(props.config.parts.filterEntities(props.element))
	}

	if (props.config.parts.filterNotes != null) {
		entry.notes = props.parent.notes.filter(props.config.parts.filterNotes(props.element))
	}

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

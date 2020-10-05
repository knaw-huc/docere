import { Entry, MetadataItem, GetEntryProps, GetPartProps, ConfigEntry, SerializedEntry } from '@docere/common'
import { FacsimileArea, Facsimile, LayerType, TextData, DocereConfig, setTitle } from '@docere/common'
import { isTextLayerConfig, isSerializedTextLayer } from '@docere/common'
import { SerializedLayer } from '@docere/common'

export type GetDefaultEntry = (id: string) => ConfigEntry
export function getDefaultEntry(id: string): ConfigEntry {
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

function addCount(prev: Map<string, TextData>, curr: TextData) {
	if (prev.has(curr.id)) prev.get(curr.id).count += 1
	else prev.set(curr.id, { ...curr, count: 1 })
	return prev
}

function extractMetadata(entry: ConfigEntry, config: DocereConfig): Entry['metadata'] {
	return config.metadata
		.map(md => ({
			...md,
			value: md.extract(entry, config)
		}) as MetadataItem)
 		.sort((config1, config2) => config1.order - config2.order)
}

function extractLayers(entry: ConfigEntry, parent: ConfigEntry, config: DocereConfig): SerializedLayer[] {
	return config.layers
		.map(layer => {
			const filterEntities = layer.filterEntities != null ? layer.filterEntities : () => () => true
			const filterFacsimiles = layer.filterFacsimiles != null ? layer.filterFacsimiles : () => () => true
			const filterNotes = layer.filterNotes != null ? layer.filterNotes : () => () => true

			const textLayer: SerializedLayer = {
				active: layer.active != null ? layer.active : true,
				entities: parent.entities?.filter(filterEntities(entry)),
				facsimiles: parent.facsimiles?.filter(filterFacsimiles(entry)),
				id: layer.id,
				notes: parent.notes?.filter(filterNotes(entry)),
				pinned: layer.pinned != null ? layer.pinned : false,
				type: layer.type != null ? layer.type : LayerType.Text,
				title: layer.title,
			}

			if (isSerializedTextLayer(textLayer) && isTextLayerConfig(layer)) {
				const extractContent = layer.extract == null ? (entry: ConfigEntry) => entry.element : layer.extract
				textLayer.content = xmlToString(extractContent(entry, config))
			}

			return setTitle(textLayer)
		})
}

function extractEntities(entry: ConfigEntry, config: DocereConfig) {
	const entities: Map<string, TextData> = config.entities
		.reduce((prev, curr) => {
			const extracted = curr.extract(entry, config)
				.map(x => ({ ...x, config: curr }))
			return prev.concat(extracted)
		}, [])
		.reduce(addCount, new Map<string, TextData>())

	return Array.from(entities.values())
}

function extractNotes(entry: ConfigEntry, config: DocereConfig) {
	return config.notes
		.reduce((prev, curr) => {
			const extracted = curr.extract(entry, config)
				.map(x => ({ ...x, config: curr }))
			return prev.concat(extracted)
		}, [])
}

export function extractEntryData(entry: ConfigEntry, config: DocereConfig) {
	entry.metadata = extractMetadata(entry, config)

	entry.facsimiles = config.facsimiles?.extract(entry, config).map(extendFacsimile)
	entry.entities = extractEntities(entry, config)
	entry.notes = extractNotes(entry, config)

	// Extraction of layers depends on entry.facsimiles, entry.entities and entry.notes
	entry.layers = extractLayers(entry, entry, config)
}

export function extractParts(entry: ConfigEntry, config: DocereConfig) {
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

	entry.parent = props.parent
	entry.metadata = extractMetadata(entry, props.config)

	entry.document = props.document
	entry.element =  props.element

	entry.layers = extractLayers(entry, props.parent, props.config)

	return entry
}

export type XmlToString = (xml: XMLDocument | Element) => string
export function xmlToString(xml: XMLDocument | Element) {
	if (xml == null) return null
	return new XMLSerializer().serializeToString(xml)
}

export type GetEntrySync = (props: GetEntryProps) => ConfigEntry
export function getEntrySync(props: GetEntryProps) {
	const entry = getDefaultEntry(props.id)
	entry.document = props.document
	entry.element =  props.element
	extractEntryData(entry, props.config)
	extractParts(entry, props.config)
	return entry
}

export type SerializeEntry = (entry: ConfigEntry, config: DocereConfig) => SerializedEntry
export function serializeEntry(entry: ConfigEntry, config: DocereConfig): SerializedEntry {
	return {
		content: xmlToString(entry.document),
		id: entry.id,
		layers: entry.layers,
		metadata: entry.metadata,
		parts: Array.from(entry.parts || []).map((part =>
			serializeEntry(part[1], config))
		),
		plainText: config.plainText(entry, config),
	}
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

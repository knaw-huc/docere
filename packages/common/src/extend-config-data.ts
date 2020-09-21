import { Colors, EsDataType, RsType } from './enum'

import type { FacetConfigBase } from './types/search/facets'
// import type { DocereConfigDataRaw, DocereConfigData } from './types/config-data'
import type { DocereConfig, MetadataConfig, EntityConfig } from './types/config-data/config'
import type { PageConfig } from './types/page'
import { isTextLayerConfig } from './utils'

export const defaultEntrySettings: DocereConfig['entrySettings'] = {
	'panels.showHeaders': true,
	'panels.text.openPopupAsTooltip': true,
	'panels.text.showMinimap': true,
	'panels.text.showLineBeginnings': true,
	'panels.text.showPageBeginnings': true,
	'panels.text.showEntities': true,
	'panels.text.showNotes': true,
}

const defaultConfig: DocereConfig = {
	collection: null,
	entities: [],
	entrySettings: {},
	layers: [],
	metadata: [],
	notes: [],
	parts: null,
	pages: [],
	private: false,
	searchResultCount: 20,
	slug: null,
}

export const defaultMetadata: MetadataConfig = {
	datatype: EsDataType.Keyword,
	extract: () => null,
	id: null,
	// TODO fixate the order number, which means: if there is no order than increment the order number: 999, 1000, 1001, 1002 (import for example the sort setting in the FS)
	order: 9999,
	showAsFacet: true,
	showInAside: true,
}

export const defaultEntityConfig: Omit<EntityConfig, 'extract'> = {
	...defaultMetadata,
	color: Colors.Blue,
	revealOnHover: false,
	type: RsType.None,
}

// const defaultDocereFunctions: DocereConfigFunctions = {
// 	extractFacsimiles: function extractFacsimiles(_el) { return [] },
// 	extractMetadata: function extractMetadata(_el) { return {} },
// 	prepareDocument: function prepareDocument(entry) { return entry.document.documentElement },
// 	extractText: function extractText(entry) { return entry.element.textContent },
// }

// Add a title to a config if the title is not explicitly set in the config
export function setTitle<T extends FacetConfigBase>(entityConfig: T): T {
	if (entityConfig.title == null) {
		entityConfig.title = entityConfig.id.charAt(0).toUpperCase() + entityConfig.id.slice(1)
	}
	return entityConfig
}

function setPath(page: PageConfig) {
	if (page.path == null) page.path = `${page.id}.xml`
	return page
}

function extendTextData(td: EntityConfig) {
	const textDataConfig = {...defaultEntityConfig, ...td } as EntityConfig
	return setTitle(textDataConfig)
}

// TODO rename to extendConfig
export function extendConfigData(configDataRaw: DocereConfig): DocereConfig {
	const config = { ...defaultConfig, ...configDataRaw }
	if (config.title == null) config.title = config.slug.charAt(0).toUpperCase() + config.slug.slice(1)

	config.entrySettings = { ...defaultEntrySettings, ...config.entrySettings }
	config.layers = config.layers.map(layer => {
		if (isTextLayerConfig(layer) && layer.extract == null) {
			layer.extract = (entry) => entry.element
		}
		return setTitle(layer)
	})

	config.metadata = config.metadata.map(md => {
		const metadataConfig = {...defaultMetadata, ...md} as MetadataConfig
		return setTitle(metadataConfig)
	})

	config.entities = config.entities.map(extendTextData)
	config.notes = config.notes.map(extendTextData)

	config.pages = config.pages.map(page => {
		if (Array.isArray(page.children)) {
			page.children = page.children.map(p => setTitle(setPath(p)))
		}
		return setTitle(setPath(page))
	})

	config.parts = {
		keepSource: false,
		...config.parts
	}

	return {
		prepare: entry => entry.document.documentElement,
		plainText: entry => entry.element.textContent,
		...config,
	}
}

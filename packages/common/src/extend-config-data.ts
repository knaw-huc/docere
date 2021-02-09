import { DocereConfig, MetadataConfig, EntityConfig, defaultEntityConfig, defaultMetadata } from './types/config-data/config'
import { isTextLayerConfig } from './utils'
import { PageConfig } from './page'

import type { FacetConfigBase } from './types/search/facets'

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
	parts: null,
	pages: null,
	private: false,
	searchResultCount: 20,
	slug: null,
}

// const defaultDocereFunctions: DocereConfigFunctions = {
// 	extractFacsimiles: function extractFacsimiles(_el) { return [] },
// 	extractMetadata: function extractMetadata(_el) { return {} },
// 	prepareDocument: function prepareDocument(entry) { return entry.document.documentElement },
// 	extractText: function extractText(entry) { return entry.element.textContent },
// }

// Add a title to a config if the title is not explicitly set in the config
export function setTitle<T extends FacetConfigBase>(entityConfig: T): T & { title: string } {
	return {
		...entityConfig,
		title: entityConfig.title == null ? 
			entityConfig.id.charAt(0).toUpperCase() + entityConfig.id.slice(1) :
			entityConfig.title,
	}
}

function extendPage(config: DocereConfig) {
	return function extendPage(page: PageConfig) {
		if (Array.isArray(page.children)) {
			page.children = page.children.map(p => setTitle(setPath(p, config)))
		}
		return setTitle(setPath(page, config))
	}
}

function setPath(page: PageConfig, config: DocereConfig) {
	if (page.remotePath == null) {
		page.remotePath = config.pages.getRemotePath != null ?
			config.pages.getRemotePath(page) :
			`${page.id}.xml`
	}
	return page
}

function extendEntities<T extends EntityConfig>(td: T) {
	const textDataConfig = {...defaultEntityConfig, ...td } as EntityConfig
	return setTitle(textDataConfig)
}

// TODO rename to extendConfig
export function extendConfigData(configDataRaw: DocereConfig): DocereConfig {
	const config = { ...defaultConfig, ...configDataRaw }
	if (config.title == null) config.title = config.slug.charAt(0).toUpperCase() + config.slug.slice(1)

	config.documents = {
		remoteDirectories: [config.slug],
		stripRemoteDirectoryFromDocumentId: true,
		...(config.documents || {})
	}

	config.entrySettings = { ...defaultEntrySettings, ...config.entrySettings }
	config.layers = config.layers.map(layer => {
		if (isTextLayerConfig(layer) && layer.extractElement == null) {
			layer.extractElement = (entry) => entry.preparedElement
		}
		return setTitle(layer)
	})

	config.metadata = config.metadata.map(md => {
		const metadataConfig = {...defaultMetadata, ...md} as MetadataConfig
		return setTitle(metadataConfig)
	})

	config.entities = config.entities.map(extendEntities)

	if (config.pages != null) {
		config.pages = {
			...config.pages,
			config: config.pages.config.map(extendPage(config))
		}
	}


	if (config.parts != null) {
		config.parts = {
			keepSource: false,
			...config.parts
		}
	}

	return {
		prepare: entry => entry.document.documentElement,
		plainText: entry => entry.preparedElement.textContent,
		...config,
	}
}

import { Colors, EsDataType, RsType } from './enum'

import type { DocereConfigFunctions } from './types/config-data/functions'
import type { FacetConfigBase } from './types/search/facets'
import type { DocereConfigDataRaw, DocereConfigData } from './types/config-data'
import type { DocereConfig, MetadataConfig, EntityConfig } from './types/config-data/config'
import type { PageConfig } from './types/page'

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
	slug: 'unknown-project',
	title: 'Unknown project',
}

export const defaultMetadata: MetadataConfig = {
	datatype: EsDataType.Keyword,
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

const defaultDocereFunctions: DocereConfigFunctions = {
	prepareDocument: function prepareDocument(entry) { return entry.document.documentElement },
	extractFacsimiles: function extractFacsimiles(_el) { return [] },
	extractMetadata: function extractMetadata(_el) { return {} },
	extractText: function extractText(entry) { return entry.element.textContent },
}

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


function extendTextData(config: DocereConfig) {
	return function (td: EntityConfig) {
		const textDataConfig = {...defaultEntityConfig, ...td } as EntityConfig

		// If not text layers are set on the config, add all text layers
		if (!Array.isArray(td.textLayers)) {
			textDataConfig.textLayers = config.layers.map(tl => tl.id)
		}

		return setTitle(textDataConfig)
	}
}

export function extendConfigData(configDataRaw: DocereConfigDataRaw): DocereConfigData {
	const config = { ...defaultConfig, ...configDataRaw.config }
	config.entrySettings = { ...defaultEntrySettings, ...config.entrySettings }
	config.layers = config.layers.map(setTitle)

	config.metadata = config.metadata.map(md => {
		const metadataConfig = {...defaultMetadata, ...md} as MetadataConfig
		return setTitle(metadataConfig)
	})

	config.entities = config.entities.map(extendTextData(config))
	config.notes = config.notes.map(extendTextData(config))

	config.pages = config.pages.map(page => {
		if (Array.isArray(page.children)) {
			page.children = page.children.map(p => setTitle(setPath(p)))
		}
		return setTitle(setPath(page))
	})

	return {
		getComponents: () => async () => null, /* default to null and an object because of React reference checking */
		getUIComponent: () => async () => null,
		...defaultDocereFunctions,
		...configDataRaw,
		config,
	}
}

import type { DocereConfig } from '.'
import { ensureEnd, PartialStandoff } from '..'
import { defaultEntityConfig, EntityConfig } from '../entry/entity'
import { BaseConfig, defaultFacetConfig, defaultMetadata } from '../entry/metadata'
import { Language } from '../enum'
import type { PageConfig } from '../page'
import { defaultEntrySettings } from './entry-settings'

const defaultConfig: DocereConfig = {
	collection: null,
	entities2: [],
	entrySettings: {},
	language: Language.EN,
	layers2: [],
	metadata2: [],
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
export function setTitle<T extends BaseConfig>(entityConfig: T): T & { title: string } {
	let title = entityConfig.title

	if (title == null) {
		title = (entityConfig.id.charAt(0).toUpperCase() + entityConfig.id.slice(1))
			.replace(/_/g, ' ')
	}

	return {
		...entityConfig,
		title,
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
		page.remotePath = `${config.pages.remotePath}${page.id}.xml`
	}
	return page
}

function extendEntities<T extends EntityConfig>(td: T) {
	const textDataConfig = {...defaultEntityConfig, ...td } as EntityConfig
	return setTitle(textDataConfig)
}

// TODO make PartialDocereConfig and return DocereConfig
export function extendConfig(configDataRaw: DocereConfig): DocereConfig {
	const config = { ...defaultConfig, ...configDataRaw }
	if (config.title == null) config.title = config.slug.charAt(0).toUpperCase() + config.slug.slice(1)

	config.documents = {
		remotePath: '',
		type: 'standoff',
		...(config.documents || {})
	}
	config.documents.remotePath = ensureEnd(config.documents.remotePath, '/')

	config.entrySettings = { ...defaultEntrySettings, ...config.entrySettings }

	config.layers2 = config.layers2.map(layerConfig => {
		if (layerConfig.active == null) layerConfig.active = true
		if (layerConfig.pinned == null) layerConfig.pinned = false
		return setTitle(layerConfig)
	})

	// TODO remove getValue from EntityMetadataConfig
	config.metadata2 = config.metadata2.map(md => {
		if (md.facet != null) {
			md.facet = {
				...defaultFacetConfig,
				...md.facet,
			}
		}

		const metadataConfig = {
			...defaultMetadata,
			...md
		}

		return setTitle(metadataConfig)
	})

	config.entities2 = config.entities2.map(extendEntities)

	if (config.pages != null) {
		config.pages = {
			remotePath: '',
			...config.pages,
		}

		config.pages.remotePath = ensureEnd(config.pages.remotePath, '/')
		config.pages.config = config.pages.config.map(extendPage(config))
	}

	if (config.standoff == null) config.standoff = {}
	if (config.standoff.exportOptions == null) config.standoff.exportOptions = {}
	config.standoff = {
		exportOptions: {
			...config.standoff.exportOptions
		},
		prepareStandoff: (partialStandoff) => partialStandoff,
		prepareSource: (source) => source as PartialStandoff,
		...config.standoff
	}

	if (config.facsimiles != null && config.facsimiles.getId == null) {
		config.facsimiles.getId = a => a.id
	}

	if (Array.isArray(config.parts)) {
		config.parts.map(part => ({
			keepSource: false,
			...part
		}))
	}

	if (config.search == null) config.search = {}
	config.search = {
		url: `/search/${config.slug}/_search`,
		resultsPerPage: 20,
		sortOrder: new Map(),
		...config.search
	}

	// return {
	// 	// prepare: entry => entry.document.documentElement,
	// 	// plainText: entry => entry.preparedElement.textContent,
	// 	...config,
	// }
	return config
}

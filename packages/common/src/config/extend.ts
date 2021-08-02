import { DocereConfig } from '.'
import { defaultEntityConfig, EntityConfig } from '../entry/entity'
import { BaseConfig, defaultFacetConfig, defaultMetadata } from '../entry/metadata'
import { PageConfig } from '../page'

export const defaultEntrySettings: DocereConfig['entrySettings'] = {
	'panels.showHeaders': true,
	'panels.text.openPopupAsTooltip': true,
	'panels.text.showMinimap': true,
	'panels.text.showLineBeginnings': true,
	'panels.text.showPageBeginnings': true,
	'panels.entities.show': true,
	'panels.entities.toggle': true,
	'panels.text.showNotes': true,
}

const defaultConfig: DocereConfig = {
	collection: null,
	entities2: [],
	entrySettings: {},
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

// TODO make PartialDocereConfig and return DocereConfig
export function extendConfig(configDataRaw: DocereConfig): DocereConfig {
	const config = { ...defaultConfig, ...configDataRaw }
	if (config.title == null) config.title = config.slug.charAt(0).toUpperCase() + config.slug.slice(1)

	config.documents = {
		remoteDirectories: [config.slug],
		stripRemoteDirectoryFromDocumentId: true,
		type: 'standoff',
		...(config.documents || {})
	}

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
			...config.pages,
			config: config.pages.config.map(extendPage(config))
		}
	}

	if (config.standoff == null) config.standoff = {}
	if (config.standoff.exportOptions == null) config.standoff.exportOptions = {}
	config.standoff = {
		exportOptions: {
			...config.standoff.exportOptions
		},
		prepareAnnotations: (partialAnnotations) => partialAnnotations,
		prepareExport: () => undefined,
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

	// return {
	// 	// prepare: entry => entry.document.documentElement,
	// 	// plainText: entry => entry.preparedElement.textContent,
	// 	...config,
	// }
	return config
}

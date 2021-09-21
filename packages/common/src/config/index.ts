import { PageConfig } from '../page'
import { PartialStandoff, PartialStandoffAnnotation } from '../standoff-annotations'
import { EntityConfig, FacsimileLayerConfig, ID, MetadataConfig, TextLayerConfig } from '../entry'
import { PartialExportOptions } from '../standoff-annotations/export-options'
import { FacetedSearchProps, SortOrder } from '../types'
import type { EntrySettings } from './entry-settings'
import { Language } from '../enum'

export * from './extend'
export * from './entry-settings'

// TODO rename to ProjectConfig
// TODO rename slug to id
/**
 * Project configuration
 * 
 * @interface
 */
export interface DocereConfig {
	collection?: { metadataId: string, sortBy: string } /* true if whole project is one collection, MetadataConfig.id if project consists of multiple collections */
	data?: Record<string, any>

	/** Options for the project documents */
	documents?: {
		/** 
		 * Paths to project document dirs on the remote server
		 * 
		 * @default [<project ID>]
		 */
		remoteDirectories?: string[]

		/**
		 * By default the root directory to a document (not the sub directories!)
		 * is removed from the ID. To disable this default behavior set this
		 * option to false.
		 * 
		 * @default true
		 * @example if remote directory is a/b and the file is in a/b/c/d/e.xml, the ID will be c/d/e.xml
		 */
		stripRemoteDirectoryFromDocumentId?: boolean

		/**
		 * Type of documents. XML documents are converted to standoff before further
		 * processing.
		 * 
		 * @default standoff
		 */
		type?: 'standoff' | 'xml' | 'json'
	}

	entrySettings?: EntrySettings

	facsimiles?: Pick<EntityConfig, 'filter' | 'getId'> & {
		getPath: EntityConfig['getValue']
	}

	language?: Language,

	layers2?: (TextLayerConfig | FacsimileLayerConfig)[]
	entities2?: EntityConfig[]
	metadata2?: MetadataConfig[]

	/**
	 * Configure the background pages of the project, for example:
	 * about, colofon, manual, structured data (people, places, ...)
	 * 
	 * TODO rename to main menu? because the menu can have pages, but also links
	 */
	pages?: {
		/**
		 * Page configs. The hierarchy of the configuration
		 * is used to display the pages in a menu reflecting given
		 * hierarchy
		 */
		config: (PageConfig | UrlMenuItem)[]

		/**
		 * Get the remote path of the pages.
		 * 
		 * Order of precedence to get the remote path:
		 * 1. PageConfig['remotePath']
		 * 2. getRemotePath
		 * 3. ${PageConfig['id']}.xml
		 */
		getRemotePath?: (config: PageConfig) => string
	}

	parts?: PartConfig[],

	standoff?: {
		exportOptions?: PartialExportOptions

		/**
		 * Function to convert any input to {@link PartialStandoff}
		 * 
		 * The source can be either standoff, xml or json. The json
		 * must be converted to standoff or xml in the prepareSource
		 * function.
		 * 
		 * TODO remove XML from the options, if XML is passed, it should be
		 * parsed first. prepareSource should be isomorphic (same code on client
		 * and server), but to convert from XML to standoff, can only be done on
		 * the server (for now)
		 */
		prepareSource?: (source: string | object) => PartialStandoff

		/**
		 * Function to alter the partial standoff annotations before processing
		 * 
		 * The {@link PartialStandoff | partial standoff} of the entry, the source
		 * and the {@link PartConfig | part config} are passed as arguments. The
		 * source can differ from the entry when the source is splitted into
		 * {@link PartConfig | parts}. It can be very usefull when extending a
		 * part, there is access to the whole source.
		 */
		prepareStandoff?: (
			entryPartialStandoff: PartialStandoff,
			sourcePartialStandoff: PartialStandoff,
			partConfig: PartConfig
		) => PartialStandoff

		/**
		 * Function to prepare the export of the {@link StandoffTree}. Most changes
		 * to the {@link StandoffAnnotation}s should be done using the {@link DocereConfig.standoff.prepareAnnotations}
		 * function, but some need the tree, for example when finding annotations
		 * {@link StandoffTree.findBefore | before} and {@link StandoffTree.findAfter | after}.
		 */
		// prepareExport?: (standoffTree: StandoffTree) => void
	}
	private?: boolean
	searchResultCount?: number
	search?: {
		resultsPerPage?: FacetedSearchProps['resultsPerPage'],
		sortOrder?: SortOrder
		url?: FacetedSearchProps['url'],
	}
	slug: ID
	title?: string
}

export interface PartConfig {
	id: ID
	filter?: (a: PartialStandoffAnnotation) => boolean
	getId?: (a: PartialStandoffAnnotation) => string
	keepSource?: boolean
}

export interface UrlMenuItem {
	title: string
	url: string
}

export function isUrlMenuItem(obj: Object): obj is UrlMenuItem {
	return obj.hasOwnProperty('title') && obj.hasOwnProperty('url')
}

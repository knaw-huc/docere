import { PageConfig } from '../page'
import { PartialExportOptions, PartialStandoff, PartialStandoffAnnotation, StandoffTree, StandoffWrapper } from '../standoff-annotations'
import { EntityConfig, FacsimileLayerConfig, ID, MetadataConfig, TextLayerConfig } from '../entry'

export * from './extend'

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
		type?: 'standoff' | 'xml'
	}

	entrySettings?: EntrySettings

	facsimiles?: Pick<EntityConfig, 'filter' | 'getId'> & {
		getPath: EntityConfig['getValue']
	}

	layers2?: (TextLayerConfig | FacsimileLayerConfig)[]
	entities2?: EntityConfig[]
	metadata2?: MetadataConfig[]

	/**
	 * Configure the background pages of the project, for example:
	 * about, colofon, manual, structured data (people, places, ...)
	 */
	pages?: {
		/**
		 * Page configs. The hierarchy of the configuration
		 * is used to display the pages in a menu reflecting given
		 * hierarchy
		 */
		config: PageConfig[]

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
	standoff?: {
		exportOptions?: PartialExportOptions

		/**
		 * Function to convert any input to {@link PartialStandoff}
		 */
		prepareSource?: (source: any) => PartialStandoff

		/**
		 * Function to prepare the annotations using the thin wrapper of
		 * {@link StandoffWrapper}. The class allows alteration of the annotations
		 * before it is added to the {@link StandoffTree}. Using a StandoffWrapper
		 * is faster than using a StandoffTree, with almost the same functionality.
		 * If the StandoffTree is needed, use {@link DocereConfig.standoff.prepareExport}
		 */
		prepareAnnotations?: (standoffWrapper: StandoffWrapper<PartialStandoffAnnotation>) => void

		/**
		 * Function to prepare the export of the {@link StandoffTree}. Most changes
		 * to the {@link StandoffAnnotation}s should be done using the {@link DocereConfig.standoff.prepareAnnotations}
		 * function, but some need the tree, for example when finding annotations
		 * {@link StandoffTree.findBefore | before} and {@link StandoffTree.findAfter | after}.
		 */
		prepareExport?: (standoffTree: StandoffTree) => void
	}
	private?: boolean
	searchResultCount?: number
	slug: ID
	title?: string
}

export interface EntrySettings {
	'panels.showHeaders'?: boolean

	'panels.text.openPopupAsTooltip'?: boolean
	'panels.text.showMinimap'?: boolean
	'panels.text.showLineBeginnings'?: boolean
	'panels.text.showPageBeginnings'?: boolean
	'panels.text.showNotes'?: boolean,

	/**
	 * Automatically remove current active entities when activating a new entity.
	 * When set to false, the previous active entities stay active and highlighted.
	 */ 
	'panels.entities.toggle'?: boolean,

	/** Show/hide entities */
	'panels.entities.show'?: boolean,
}

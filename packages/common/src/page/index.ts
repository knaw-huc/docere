import { BaseConfig } from '../entry/metadata'
import { ComponentProps } from '../standoff-annotations'

export * from './use-page'

/**
 * Config for pages
 * 
 * Pages give background information on a project, like contact, about,
 * bibliography, etc. Pages can also be used to store structured data like
 * persons, places, etc.
 * 
 * @interface
 */
export interface PageConfig extends BaseConfig {

	/**
	 * Page configurations can be nested
	 * 
	 * @default []
	 */
	children?: PageConfig[]

	/**
	 * Path to the page on the remote server.
	 * 
	 * @default <pageConfig.id>.xml
	 * @example <some-dir>/<some-file>.xml
	 */
	remotePath?: string

	/**
	 * Options for splitting a document into multiple items.
	 * 
	 * The items can be used to show parts of the page in an annotation in the text.
	 * 
	 * @default null
	 * @todo turn into function (function(doc) => PagePart[])
	 */
	split?: {
		/** Extract the ID of an item */
		extractId: (el: Element) => string

		/** CSS selector to querySelectorAll the items  */
		selector: string
	}
}

export type Page = PageConfig & {
	doc: XMLDocument
	parts: Map<string, Element>
}

export interface PageComponentProps extends ComponentProps {
	activeId: string
}

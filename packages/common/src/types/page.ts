import { BaseConfig } from './config-data/config';

export interface PageConfig extends BaseConfig {
	children?: PageConfig[]
	path?: string
	split?: {
		extractId: (el: Element) => string
		selector: string
	}
}

export type Page = PageConfig & {
	doc: XMLDocument
	parts: Map<string, Element>
}

import type { Entry, ExtractedLayer } from '@docere/common'

export type PrepareAndExtractOutput = Omit<Entry, 'doc' | 'layers'> & {
	text: string
	layers: ExtractedLayer[]
}

/**
 * JSON object which represents a ElasticSearch document
 */
export interface ElasticSearchDocument {
	facsimiles: string[]
	id: string
	text: string
	text_suggest: { input: string[] }
	[key: string]: any
}

export type MappingProperties = Record<string, {
	type: import('../../common/src/enum').EsDataType
	[key: string]: string | number | boolean
}>

export interface Mapping {
	mappings: {
		properties: MappingProperties
	}
}

export interface DocereApiError {
	__error: string
	code?: number
}

import type { SerializedEntry, EsDataType } from '../../common/src'

export type ExtractedXml = { original: string, prepared: string }
export type PrepareAndExtractOutput = [SerializedEntry, ExtractedXml]

/**
 * JSON object which represents a ElasticSearch document
 */
export interface ElasticSearchDocument {
	facsimiles: string[]
	id: string
	// notes: string[]
	text: string
	text_suggest: { input: string[] }
	[key: string]: any
}

export type MappingProperties = Record<string, {
	type: EsDataType
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

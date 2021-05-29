import type { JsonEntry, EsDataType } from '@docere/common'

export type ExtractedXml = { original: string, prepared: string }
export type PrepareAndExtractOutput = [JsonEntry, ExtractedXml]

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

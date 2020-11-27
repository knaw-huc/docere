import type { SerializedEntry, EsDataType } from '../../common/src'

export type ExtractedXml = { original: string, prepared: string }
export type PrepareAndExtractOutput = [SerializedEntry, ExtractedXml]

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

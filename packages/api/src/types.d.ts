/// <reference types="@docere/common" />

type PrepareAndExtractOutput = Omit<Entry, 'doc' | 'layers'> & {
	text: string
	layers: ExtractedLayer[]
}

/**
 * JSON object which represents a ElasticSearch document
 */
interface ElasticSearchDocument {
	facsimiles: string[]
	id: string
	text: string
	text_suggest: { input: string[] }
	[key: string]: any
}

type MappingProperties = Record<string, {
	type: import('../../common/src/enum').EsDataType
	[key: string]: string | number | boolean
}>

interface Mapping {
	mappings: {
		properties: MappingProperties
	}
}

interface DocereApiError {
	__error: string
	code?: number
}

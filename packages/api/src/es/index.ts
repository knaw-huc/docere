import * as es from '@elastic/elasticsearch'

import { CreateJsonEntryPartProps, EsDataType, JsonEntry } from '@docere/common'
import { isError, getProjectConfig } from '../utils'
import { createElasticSearchDocument } from './create-document'


import type { Mapping, DocereApiError } from '../types'
import { DocereConfig, isHierarchyFacetConfig } from '@docere/common'


export async function initProjectIndex(projectId: string) {
	const esClient = new es.Client({ node: 'http://es01:9200' })

	// Delete the previous index
	try {
		await esClient.indices.delete({ index: projectId })	
	} catch (err) {
		// console.log('deleteIndex', err)	
	}

	const mapping = await getProjectIndexMapping(projectId)

	// Create a fresh index
	try {
		await esClient.indices.create({
			index: projectId,
			body: mapping
		})	
	} catch (err) {
		console.log('createIndex', err)
	}

	esClient.close()
}

export async function getProjectIndexMapping(projectId: string): Promise<Mapping | DocereApiError> {
	const config = await getProjectConfig(projectId)
	if (isError(config)) return config
	
	const properties: Mapping['mappings']['properties'] = {
		text_suggest: {
			type: EsDataType.Completion,
			analyzer: "simple",
			preserve_separators: true,
			preserve_position_increments: true,
			max_input_length: 50,
		}
	};

	[...config.metadata2, ...config.entities2]
		.forEach(md => {
			const type = getMetadataType(md.id, config)
			if (type != null) {
				if (isHierarchyFacetConfig(md.facet)) {
					let level = md.facet.levels - 1
					while (level >= 0) {
						properties[`${md.id}_level${level}`] = { type }
						level--
					}
				} else {
					properties[md.id] = { type }
				}
			}
		})

	return {
		mappings: { properties }
	}
}

export async function indexDocument(
	extractedEntry: JsonEntry,
	// createJsonEntryProps: CreateJsonEntryPartProps,
	projectConfig: DocereConfig,
	esClient: es.Client
) {
	const esDocument = createElasticSearchDocument(extractedEntry, createJsonEntryProps)
	if (isError(esDocument)) return esDocument

	try {
		await esClient.update({
			id: esDocument.id,
			index: projectConfig.slug,
			body: {
				doc: esDocument,
				doc_as_upsert: true,
			}
		})
	} catch (err) {
		return { __error: err }
	}
}

function getMetadataType(key: string, config: DocereConfig): EsDataType {
	if (key === 'text') return EsDataType.Text

	let type = EsDataType.Keyword

	const mdConfig = config.metadata2.find(md => md.id === key)

	if (mdConfig != null) {
		if (mdConfig.facet == null) {
			return null
		} else if (mdConfig.facet.datatype != null) {
			type = mdConfig.facet.datatype
		}
	} else {
		const tdConfig = config.entities2.find(md => md.id === key)

		if (tdConfig != null) {
			if (tdConfig.facet == null) {
				return null
			} else if (tdConfig.facet.datatype != null) {
				type = tdConfig.facet.datatype
			}
		}
	}

	if (type === EsDataType.Hierarchy) return EsDataType.Keyword
	if (type === EsDataType.Null) return null

	return type
}

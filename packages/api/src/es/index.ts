import * as es from '@elastic/elasticsearch'

import { EsDataType, JsonEntry, isHierarchyFacetConfig } from '../../../common/src'
import { getType, isError, getElasticSearchDocument, getProjectConfig } from '../utils'

import type { Mapping, DocereApiError } from '../types'
import { Standoff } from '@docere/common'


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

	[...config.metadata, ...config.entities]
		.forEach(md => {
			const type = getType(md.id, config)
			if (type != null) {
				if (isHierarchyFacetConfig(md)) {
					let level = md.levels - 1
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
	projectId: string,
	extractedEntry: JsonEntry,
	standoff: Standoff,
	esClient: es.Client
) {
	const esDocument = getElasticSearchDocument(extractedEntry, standoff)
	if (isError(esDocument)) return esDocument

	try {
		await esClient.update({
			id: esDocument.id,
			index: projectId,
			body: {
				doc: esDocument,
				doc_as_upsert: true,
			}
		})
	} catch (err) {
		return { __error: err }
	}
}

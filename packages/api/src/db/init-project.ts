import path from 'path'
import { getPool, tryQuery } from './index'
import { getType, isError, getElasticSearchDocument } from '../utils'
import { DocereApiError, MappingProperties } from '../types'
import { DocereConfig, EsDataType, SerializedEntry } from '../../../common/src'
const projects = require('esm')(module)(path.resolve(process.cwd(), './packages/projects')).default
import * as es from '@elastic/elasticsearch'

export async function initProject(projectId: string) {
	const pool = await getPool(projectId)
	const client = await pool.connect()

	await tryQuery(client, 'BEGIN')
	await tryQuery(client, `DROP TABLE IF EXISTS xml, document, tag, attribute cascade;`)
	await tryQuery(
		client,
		`CREATE TABLE xml (
			id SERIAL PRIMARY KEY,
			name TEXT UNIQUE,
			hash TEXT UNIQUE, 
			content TEXT,
			prepared TEXT,
			standoff_text TEXT,
			standoff_annotations TEXT,
			updated TIMESTAMP WITH TIME ZONE
		);
	`)
	await tryQuery(
		client,
		`CREATE TABLE document (
			id SERIAL PRIMARY KEY,
			xml_id SERIAL REFERENCES xml,
			order_number INT,
			name TEXT UNIQUE,
			content TEXT,
			json JSONB,
			standoff_text TEXT,
			standoff_annotations TEXT,
			updated TIMESTAMP WITH TIME ZONE
		);
	`)
	await tryQuery(client, 'COMMIT')

	client.release()

	await initProjectIndex(projectId)
}

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

async function getProjectIndexMapping(projectId: string) {
	const config = await getProjectConfig(projectId)
	if (isError(config)) return config
	
	const properties: MappingProperties = {
		// notes: {
		// 	type: EsDataType.Text
		// },
		text_suggest: {
			type: EsDataType.Completion,
			analyzer: "simple",
			preserve_separators: true,
			preserve_position_increments: true,
			max_input_length: 50,
		}
	};

	[...config.metadata, ...config.entities]
		.map(md => md.id)
		.forEach(key => {
			const type = getType(key, config)
			if (type != null) properties[key] = { type }
		})

	return {
		mappings: { properties }
	}
}

async function getProjectConfig(projectId: string) {
	const error: DocereApiError = { code: 404, __error: `Config data not found. Does project '${projectId}' exist?` }

	let config: DocereConfig | DocereApiError
	try {
		const configImport = await projects[projectId].config
		config = configImport == null ? error : (await configImport()).default
	} catch (err) {
		console.log(err)
		config = error
	}

	return config
}

export async function indexDocument(projectId: string, extractedEntry: SerializedEntry, esClient: es.Client) {
	const esDocument = getElasticSearchDocument(extractedEntry)
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

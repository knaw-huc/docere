import { DocereConfig, JsonEntry, StandoffTree } from '@docere/common'
import * as es from '@elastic/elasticsearch'
import { PoolClient } from "pg"
import { DB, transactionQuery } from ".."
import { indexDocument } from "../../es"
import { isError } from "../../utils"

interface HandleEntryProps {
	client: PoolClient
	esClient: es.Client
	isUpdate: boolean
	entry: JsonEntry
	projectConfig: DocereConfig
	sourceTree: StandoffTree
}

/**
 * Insert entry into the DB and add the entry to the index 
 * 
 * @param param0 
 * @returns 
 */
export async function handleEntry({
	client,
	esClient,
	isUpdate,
	entry,
	projectConfig,
	sourceTree,
}: HandleEntryProps) {
	await DB.insertEntry({
		client,
		entry,
	})

	const partId = entry.partId == null ? '' : ` part '${entry.partId}'`

	const indexResult = await indexDocument(entry, sourceTree, projectConfig, esClient)
	if (isError(indexResult)) {
		await transactionQuery(client, 'ABORT')
		console.log(`Index${partId}: ${entry.id} aborted`, indexResult)
		return
	}

	console.log(`[${projectConfig.slug}] ${isUpdate ? 'Updated' : 'Added'}${partId}: '${entry.id}'`)
}


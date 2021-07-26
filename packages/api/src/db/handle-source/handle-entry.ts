import * as es from '@elastic/elasticsearch'
import { PoolClient } from "pg"
import { CreateJsonEntryPartProps, createJsonEntry } from "@docere/common"
import { DB, transactionQuery } from ".."
import { indexDocument } from "../../es"
import { isError } from "../../utils"

interface HandleEntryProps {
	client: PoolClient
	esClient: es.Client
	isUpdate: boolean
	props: CreateJsonEntryPartProps
}

/**
 * Handle an entry means: create JSON entry, insert it into the DB and
 * add the entry to the index 
 * 
 * @param param0 
 * @returns 
 */
export async function handleEntry({
	client,
	esClient,
	isUpdate,
	props,
}: HandleEntryProps) {
	const entry = createJsonEntry(props)

	await DB.insertEntry({
		client,
		id: props.id,
		entry,
		sourceId: props.sourceId,
	})

	const partId = props.partConfig == null ? '' : ` part '${props.partConfig.id}'`

	const indexResult = await indexDocument(entry, props, esClient)
	if (isError(indexResult)) {
		await transactionQuery(client, 'ABORT')
		console.log(`Index${partId}: ${entry.id} aborted`, indexResult)
		return
	}

	console.log(`[${props.projectConfig.slug}] ${isUpdate ? 'Updated' : 'Added'}${partId}: '${entry.id}'`)
}


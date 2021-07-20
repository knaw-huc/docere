import * as es from '@elastic/elasticsearch'
import { PoolClient } from "pg"
import { StandoffAnnotation, PartConfig, DocereConfig, CreateJsonEntryPartProps, createJsonEntry, StandoffTree, JsonEntry } from "@docere/common"
import { transactionQuery } from ".."
import { indexDocument } from "../../es"
import { isError } from "../../utils"

interface AddDocumentProps {
	client: PoolClient
	esClient: es.Client
	id: string
	isUpdate: boolean
	partConfig?: PartConfig
	projectConfig: DocereConfig
	root: StandoffAnnotation
	sourceId?: string
	sourceTree: StandoffTree
}

export async function addDocument({
	client,
	esClient,
	id,
	isUpdate,
	partConfig,
	projectConfig,
	root,
	sourceId,
	sourceTree,
}: AddDocumentProps) {
	const createJsonEntryPartProps: CreateJsonEntryPartProps = {
		config: projectConfig,
		id,
		partConfig,
		root,
		sourceTree,
	}

	const entry = createJsonEntry(createJsonEntryPartProps)

	await addDocumentToDb({
		client,
		id,
		entry,
		sourceId,
	})

	const partId = partConfig == null ? '' : ` part '${partConfig.id}'`

	const indexResult = await indexDocument(entry, createJsonEntryPartProps, esClient)
	if (isError(indexResult)) {
		await transactionQuery(client, 'ABORT')
		console.log(`Index${partId}: ${entry.id} aborted`, indexResult)
		return
	}

	console.log(`[${projectConfig.slug}] ${isUpdate ? 'Updated' : 'Added'}${partId}: '${entry.id}'`)
}


interface AddDocumentToDbProps extends Pick<AddDocumentProps, 'client' | 'id' | 'sourceId'> {
	entry: JsonEntry
}
/**
 * Add document to DB 
 * 
 * @param props
 */
async function addDocumentToDb({ client, entry, id, sourceId }: AddDocumentToDbProps) {
	await transactionQuery(
		client,
		`INSERT INTO document
			(name, source_id, entry, updated)
		VALUES
			($1, $2, $3, NOW())
		ON CONFLICT (name) DO UPDATE
		SET
			source_id=$2,
			entry=$3,
			updated=NOW()
		RETURNING id;`,
		[
			id,
			sourceId,
			JSON.stringify(entry)
		]
	)
}

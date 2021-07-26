import { ID, JsonEntry } from "@docere/common"
import { PoolClient } from "pg"
import { transactionQuery } from "."

interface InsertEntryProps {
	client: PoolClient
	id: ID
	sourceId: ID
	entry: JsonEntry
}

/**
 * Add document to DB 
 * 
 * @param props
 */
export async function insertEntry({ client, entry, id, sourceId }: InsertEntryProps) {
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

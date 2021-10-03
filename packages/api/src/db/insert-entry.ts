import { JsonEntry } from "@docere/common"
import { PoolClient } from "pg"
import { DB } from "."

interface InsertEntryProps {
	client: PoolClient
	entry: JsonEntry
}

/**
 * Add document to DB 
 * 
 * @param props
 */
export async function insertEntry({ client, entry }: InsertEntryProps) {
	await DB.transaction(
		client,
		`INSERT INTO entry
			(name, source_id, standoff, updated)
		VALUES
			($1, $2, $3, NOW())
		ON CONFLICT (name) DO UPDATE
		SET
			source_id=$2,
			standoff=$3,
			updated=NOW()
		RETURNING id;`,
		[
			entry.id,
			entry.sourceId + '',
			JSON.stringify(entry)
		]
	)
}

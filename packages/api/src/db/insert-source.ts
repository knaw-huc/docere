import { ID } from "@docere/common"
import { PoolClient } from "pg"
import { DB } from "."
import { getHash } from './handle-source'

interface InsertSourceProps {
	client: PoolClient
	id: ID
	stringifiedSource: string
}

export async function insertSource({ client, id, stringifiedSource }: InsertSourceProps) {
	const { rows } = await DB.transaction(
		client,
		`INSERT INTO source
			(name, hash, standoff, updated)
		VALUES
			($1, $2, $3, NOW())
		ON CONFLICT (name) DO UPDATE
		SET
			hash=$2,
			standoff=$3,
			updated=NOW()
		RETURNING id;`,
		[id, getHash(stringifiedSource), stringifiedSource],
		true
	)
	return rows[0].id
}

import { ID } from "@docere/common"
import { PoolClient } from "pg"
import { transactionQuery } from "."
import { getHash } from './handle-source'

interface InsertSourceProps {
	client: PoolClient
	id: ID
	stringifiedSource: string
}

export async function insertSource({ client, id, stringifiedSource }: InsertSourceProps) {
	const { rows } = await transactionQuery(
		client,
		`INSERT INTO source
			(name, hash, content, updated)
		VALUES
			($1, $2, $3, NOW())
		ON CONFLICT (name) DO UPDATE
		SET
			hash=$2,
			content=$3,
			updated=NOW()
		RETURNING id;`,
		[id, getHash(stringifiedSource), stringifiedSource]
	)
	return rows[0].id
}

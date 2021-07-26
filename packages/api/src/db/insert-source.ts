import { ID, PartialStandoff2, PartialStandoffAnnotation } from "@docere/common"
import { PoolClient } from "pg"
import { transactionQuery } from "."
import { getHash } from './handle-source'

interface InsertSourceProps {
	client: PoolClient
	id: ID
	stringifiedSource: string
	standoff: PartialStandoff2<PartialStandoffAnnotation>
}

export async function insertSource({ client, id, stringifiedSource, standoff }: InsertSourceProps) {
	const { rows } = await transactionQuery(
		client,
		`INSERT INTO source
			(name, hash, content, standoff, updated)
		VALUES
			($1, md5($2), $2, $3, NOW())
		ON CONFLICT (name) DO UPDATE
		SET
			hash=$2,
			content=$3,
			standoff=$4,
			updated=NOW()
		RETURNING id;`,
		[id, getHash(stringifiedSource), stringifiedSource, JSON.stringify(standoff)]
	)
	return rows[0].id
}

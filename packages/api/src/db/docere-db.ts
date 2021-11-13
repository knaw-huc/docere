import { JsonEntry } from "@docere/common"
import crypto from 'crypto'
import { DB } from "."
import { isError } from "../utils"

function getHash(content: string) {
	const hash = crypto.createHash('md5').update(content)
	const hex = hash.digest('hex')
	return hex
}

export class DocereDB extends DB {
	constructor(protected projectId: string) {
		super(projectId)
	}

	async insertPage(id: string, stringifiedSource: string) {
		return await this.transaction(
			`INSERT INTO page
				(id, hash, standoff, updated)
			VALUES
				($1, $2, $3, NOW())
			ON CONFLICT (id) DO UPDATE
			SET
				hash=$2,
				standoff=$3,
				updated=NOW()
			RETURNING id;`,
			[id, getHash(stringifiedSource), stringifiedSource]
		)
	}


	async insertSource(id: string, stringifiedSource: string) {
		return await this.transaction(
			`INSERT INTO source
				(id, hash, standoff, updated)
			VALUES
				($1, $2, $3, NOW())
			ON CONFLICT (id) DO UPDATE
			SET
				hash=$2,
				standoff=$3,
				updated=NOW()
			RETURNING id;`,
			[id, getHash(stringifiedSource), stringifiedSource],
		)
	}

	async sourceExists(fileName: string, content: string) {
		const hash = getHash(content)
		const existsResult = await this.client.query(`
			SELECT EXISTS(
				SELECT 1
				FROM
					source
				WHERE
					id=$1
						AND
					hash=$2
			)`, [fileName, hash]
		)
		return existsResult.rows[0].exists
	}

	async insertEntry(jsonEntry: JsonEntry, source_id: string) {
		await this.transaction(
			`INSERT INTO entry
				(id, source_id, standoff, updated)
			VALUES
				($1, $2, $3, NOW())
			ON CONFLICT (id) DO UPDATE
			SET
				source_id=$2,
				standoff=$3,
				updated=NOW()
			RETURNING id;`,
			[
				jsonEntry.id,
				source_id,
				JSON.stringify(jsonEntry) // TODO does pg convert JSON?
			]
		)
	}

	async selectEntries(sourceRowId: string) {
		const selectResult = await this.query(`SELECT * FROM entry WHERE source_id=$1;`, [sourceRowId])
		if (isError(selectResult)) return selectResult
		return selectResult.rows
	}

	// TODO option 1) remove withouth using source: WHERE document.source_id = sourceId
	async deleteEntriesFromSource(sourceId: string) {
		await this.client.query(`
			DELETE FROM
				entry
			USING
				source
			WHERE
				source.id=$1
					AND
				source.id=document.source_id`,
			[sourceId]
		)
	}
}

import pg, { PoolClient } from 'pg'
import { getHash } from './handle-source'
import { insertEntry } from './insert-entry'
import { insertSource } from './insert-source'

const pgConnection = {
	password: process.env.POSTGRES_PASSWORD,
	user: process.env.POSTGRES_USER,
	host: process.env.POSTGRES_HOST,
}

const poolCache: Map<string, pg.Pool> = new Map()

export async function getPool(projectId: string) {
	if (!poolCache.has(projectId)) {
		const pool = new pg.Pool(pgConnection)
		const result = await pool.query(`SELECT 1 from pg_database WHERE datname='docere_${projectId}';`)
		if (result.rowCount === 0) {
			await pool.query(`CREATE DATABASE docere_${projectId};`)
		}
		pool.end()

		poolCache.set(projectId, new pg.Pool({
			...pgConnection,
			database: `docere_${projectId}`,
		}))
	}

	return poolCache.get(projectId)
}

export async function transactionQuery(client: pg.PoolClient, query: string, values?: (string | number)[]) {
	let result
	try {
		result = await client.query(query, values)
	} catch (error) {
		console.log(`ROLLING BACK`, query)
		console.log(error)
		await client.query('ROLLBACK')
	}
	return result
}

export const DB = {
	deleteEntriesFromSource,
	insertEntry,
	insertSource,
	sourceExists,
}


async function sourceExists(fileName: string, content: string, client: PoolClient) {
	const hash = getHash(content)
	const existsResult = await client.query(`
		SELECT EXISTS(
			SELECT 1
			FROM
				source
			WHERE
				name='${fileName}'
					AND
				hash='${hash}'
		)`
	)
	return existsResult.rows[0].exists
}

async function deleteEntriesFromSource(sourceId: string, client: PoolClient) {
	await client.query(`
		DELETE FROM
			document
		USING
			source
		WHERE
			source.name='${sourceId}'
				AND
			source.name=document.source_name`
	)
}

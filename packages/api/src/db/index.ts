import pg from 'pg'

import dotenv from 'dotenv'
dotenv.config({ path: `../../.env.${process.env.DOCERE_DTAP.toLowerCase()}`})

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
		console.log(error)
		console.log('ROLLING BACK')
		await client.query('ROLLBACK')		
	}
	return result
}

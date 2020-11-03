import { Pool, PoolClient } from 'pg'

const pgConnection = {
	password: 'docker',
	user: 'docker',
	host: 'db',
}

const poolCache: Map<string, Pool> = new Map()

export async function getPool(projectId: string) {
	if (!poolCache.has(projectId)) {
		const pool = new Pool(pgConnection)
		const result = await pool.query(`SELECT 1 from pg_database WHERE datname='docere_${projectId}';`)
		if (result.rowCount === 0) {
			await pool.query(`CREATE DATABASE docere_${projectId};`)
		}
		pool.end()

		poolCache.set(projectId, new Pool({
			...pgConnection,
			database: `docere_${projectId}`,
		}))
	}

	return poolCache.get(projectId)
}

export async function transactionQuery(client: PoolClient, query: string, values?: (string | number)[]) {
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

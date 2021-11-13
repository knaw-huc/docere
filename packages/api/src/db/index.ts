import pg from 'pg'
import { DocereApiError } from '../types'

export { addPagesToDb } from './add-pages'

// const pgConnection = {
// 	password: process.env.PGPASSWORD,
// 	user: process.env.PGUSER,
// 	host: process.env.PGHOST,
// }

const poolCache: Map<string, pg.Pool> = new Map()

// TODO move CREATE DATABASE to DocereDB.createTables() (and rename to createDatabase)?
// TODO should there be just 1 pool or 1 pool per project?
export async function getPool(projectId: string) {
	if (!poolCache.has(projectId)) {
		const pool = new pg.Pool()
		const result = await pool.query(`SELECT 1 from pg_database WHERE datname='docere_${projectId}';`)
		if (result.rowCount === 0) {
			await pool.query(`CREATE DATABASE docere_${projectId};`)
		}
		pool.end()

		poolCache.set(projectId, new pg.Pool({
			database: `docere_${projectId}`,
		}))
	}

	return poolCache.get(projectId)
}

export class DB {
	protected client: pg.PoolClient

	constructor(protected projectId: string) {}

	async init() {
		const pool = await getPool(this.projectId)
		this.client = await pool.connect()
		return this
	}

	async query(
		query: string,
		values: (string | number)[] = []
	) {
		return await this.transaction(query, values, false)
	}

	async begin() {
		await this.transaction('BEGIN')
	}

	async transaction(
		query: string,
		values?: (string | number)[],
		withRollback?: false
	): Promise<pg.QueryResult<any> | DocereApiError>
	async transaction(
		query: string,
		values?: (string | number)[],
		withRollback?: true
	): Promise<pg.QueryResult<any>>
	async transaction(
		query: string,
		values?: (string | number)[],
		withRollback = true
	): Promise<pg.QueryResult<any> | DocereApiError> {
		try {
			return await this.client.query(query, values)
		} catch (error) {
			return withRollback ?
				await this.rollback(query, error) :
				{ __error: error.message }
		}
	}

	async rollback(query: string, error: any) {
		console.log(`ROLLING BACK`, query)
		console.log(error)
		return await this.client.query('ROLLBACK')
	}

	async commit() {
		await this.transaction('COMMIT')
	}

	release() {
		return this.client.release()
	}
}


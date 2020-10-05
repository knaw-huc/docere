import { getPool, tryQuery } from './index'

export async function initProject(projectId: string) {
	const pool = await getPool(projectId)
	const client = await pool.connect()

	await tryQuery(client, 'BEGIN')
	await tryQuery(client, `DROP TABLE IF EXISTS xml, document, tag, attribute cascade;`)
	await tryQuery(
		client,
		`CREATE TABLE xml (
			id SERIAL PRIMARY KEY,
			name TEXT UNIQUE,
			hash TEXT, 
			content TEXT,
			prepared TEXT,
			standoff_text TEXT,
			standoff_annotations TEXT,
			updated TIMESTAMP WITH TIME ZONE
		);
	`)
	await tryQuery(
		client,
		`CREATE TABLE document (
			id SERIAL PRIMARY KEY,
			xml_id SERIAL REFERENCES xml,
			order_number INT,
			name TEXT UNIQUE,
			content TEXT,
			json JSONB,
			standoff_text TEXT,
			standoff_annotations TEXT,
			updated TIMESTAMP WITH TIME ZONE
		);
	`)
	await tryQuery(client, 'COMMIT')

	client.release()

}

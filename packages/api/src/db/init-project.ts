import { getPool, transactionQuery } from './index'

export async function initProject(projectId: string) {
	const pool = await getPool(projectId)
	const client = await pool.connect()

	await transactionQuery(client, 'BEGIN')
	await transactionQuery(client, `DROP TABLE IF EXISTS xml, document, page, page_item, tag, attribute cascade;`)
	await transactionQuery(
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
	await transactionQuery(
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
	await transactionQuery(
		client,
		`CREATE TABLE page (
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
	await transactionQuery(
		client,
		`CREATE TABLE page_item (
			id SERIAL PRIMARY KEY,
			page_id SERIAL REFERENCES page,
			order_number INT,
			name TEXT UNIQUE,
			content TEXT,
			json JSONB,
			standoff_text TEXT,
			standoff_annotations TEXT,
			updated TIMESTAMP WITH TIME ZONE
		);
	`)
	await transactionQuery(client, 'COMMIT')

	client.release()

}

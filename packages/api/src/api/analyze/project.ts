import { getXmlFiles, getEntryIdFromFilePath } from '../../utils'
import { getPool } from '../../db'
import { xmlToStandoff } from '../standoff'

export async function analyzeProject(projectId: string) {
	const pool = await getPool(projectId)

	await pool.query(`DROP TABLE IF EXISTS document;`)
	await pool.query(`
		CREATE TABLE document (
			id SERIAL PRIMARY KEY,
			name TEXT UNIQUE,
			text TEXT,
			annotations TEXT,
			updated TIMESTAMP WITH TIME ZONE
		);
	`)

	await pool.query(`DROP TABLE IF EXISTS tag;`)
	await pool.query(`
		CREATE TABLE tag (
			id SERIAL PRIMARY KEY,
			document_id SERIAL REFERENCES document,
			name TEXT,
			startOffset INTEGER,
			endOffset INTEGER,
			startOrder SMALLINT,
			endOrder SMALLINT
		);
	`)

	await pool.query(`DROP TABLE IF EXISTS attribute;`)
	await pool.query(`
		CREATE TABLE attribute (
			id SERIAL PRIMARY KEY,
			tag_id SERIAL REFERENCES tag,
			name TEXT,
			value TEXT
		);
	`)
	const files = await getXmlFiles(projectId)

	for (const file of files) {
		const entryId = getEntryIdFromFilePath(file, projectId)
		console.log(`[${projectId}] Inserting '${entryId}'`)
		const standoff = await xmlToStandoff(projectId, entryId)

		// Insert 1 document
		const insertDocumentResult = await pool.query(
			`INSERT INTO document
				(name, text, annotations, updated)
			VALUES
				($1, $2, $3, NOW())
			RETURNING id;`,
			[entryId, standoff.text, JSON.stringify(standoff.annotations)]
		)

		const annotationValues: any[] = []
		const attributeKeyValues: [string, string][][] = []

		standoff.annotations.forEach(annotation => {
			annotationValues.push(insertDocumentResult.rows[0].id)
			annotationValues.push(annotation.name)
			annotationValues.push(annotation.start)
			annotationValues.push(annotation.end)
			annotationValues.push(annotation.startOrder)
			annotationValues.push(annotation.endOrder)

			// Add the attribute key/value's to temporary variable
			attributeKeyValues.push(
				Object.keys(annotation.attributes).reduce((prev, curr) => {
					annotation.attributes[curr].toString()
						.split(' ')
						.forEach(value => {
							prev.push([curr, value])
						})
					return prev
				}, [] as [string, string][])
			)
		})

		// Insert all tags in one INSERT INTO statement
		const tagValuesString = [...Array(annotationValues.length/6).keys()].map(x => `($${x * 6 + 1},$${x * 6 + 2},$${x * 6 + 3},$${x * 6 + 4},$${x * 6 + 5},$${x * 6 + 6})`).join(',')
		const insertTagsResult = await pool.query(
			`INSERT INTO tag
				(document_id, name, startOffset, endOffset, startOrder, endOrder)
			VALUES
				${tagValuesString}
			RETURNING id;`,
			annotationValues
		)

		// Zip the tag IDs with the attribute's key/value's
		const attributeValues = insertTagsResult.rows.reduce((prev, curr, index) => {
			attributeKeyValues[index].forEach(([name, value]) => {
				prev.push(curr.id)
				prev.push(name)
				prev.push(value)
			})
			return prev
		}, [])

		// Insert all attributes in one INSERT INTO statement
		const attributeValuesString = [...Array(attributeValues.length/3).keys()].map(x => `($${x * 3 + 1},$${x * 3 + 2},$${x * 3 + 3})`).join(',')
		await pool.query(
			`INSERT INTO attribute
				(tag_id, name, value)
			VALUES
				${attributeValuesString};`,
			attributeValues
		)
	}

	// pool.end()
}

// insertProject('mondrian').then(() => console.log('DONE'))

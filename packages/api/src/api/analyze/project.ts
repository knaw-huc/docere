import { getXmlFiles, getEntryIdFromFilePath } from '../../utils'
import { getPool } from '../../db'
import { xmlToStandoff } from '../standoff'

function chunkArray(myArray: string[], chunk_size: number){
    var results = [];
    
    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }
    
    return results;
}

export async function analyzeProject(projectId: string) {
	const pool = await getPool(projectId)

	await pool.query(`DROP TABLE IF EXISTS document cascade;`)
	await pool.query(`
		CREATE TABLE document (
			id SERIAL PRIMARY KEY,
			name TEXT UNIQUE,
			text TEXT,
			annotations TEXT,
			updated TIMESTAMP WITH TIME ZONE
		);
	`)

	await pool.query(`DROP TABLE IF EXISTS tag cascade;`)
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

	await pool.query(`DROP TABLE IF EXISTS attribute cascade;`)
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

		// Maximum of 1000 annotations per query
		const chunkedAnnotationValues = chunkArray(annotationValues, 1000 * 6)
		for (const annotationValuesChunk of chunkedAnnotationValues) {
			// Insert all tags in one INSERT INTO statement
			const tagValuesString = [...Array(annotationValuesChunk.length/6).keys()].map(x => `($${x * 6 + 1},$${x * 6 + 2},$${x * 6 + 3},$${x * 6 + 4},$${x * 6 + 5},$${x * 6 + 6})`).join(',')
			const insertTagsResult = await pool.query(
				`INSERT INTO tag
					(document_id, name, startOffset, endOffset, startOrder, endOrder)
				VALUES
					${tagValuesString}
				RETURNING id;`,
				annotationValuesChunk
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

			// Maximum of 1000 attributes per query
			const chunkedAttributeValues = chunkArray(attributeValues, 1000 * 3)
			for (const attributeValuesChunk of chunkedAttributeValues) {
				// Insert all attributes in one INSERT INTO statement
				const attributeValuesString = [...Array(attributeValuesChunk.length/3).keys()].map(x => `($${x * 3 + 1},$${x * 3 + 2},$${x * 3 + 3})`).join(',')
				await pool.query(
					`INSERT INTO attribute
						(tag_id, name, value)
					VALUES
						${attributeValuesString};`,
					attributeValuesChunk
				)
			}
		}
	}
}

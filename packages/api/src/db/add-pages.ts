import fetch from 'node-fetch'
import { getPool, transactionQuery } from '.'

import type { DocereConfig } from '@docere/common'

async function fetchPageXml(remotePath: string) {
	const url = new URL(remotePath, process.env.DOCERE_XML_URL)
	const result = await fetch(url)
	if (result.status === 404) return
	return await result.text()
}

export async function addPagesToDb(config: DocereConfig) {
	const pool = await getPool(config.slug)
	const client = await pool.connect()

	await transactionQuery(client, 'BEGIN')

	for (const pageConfig of config.pages) {
		const content = await fetchPageXml(pageConfig.remotePath)
		if (content == null) continue

		await transactionQuery(
			client,
			`INSERT INTO page
				(name, hash, content, updated)
			VALUES
				($1, md5($2), $2, NOW())
			ON CONFLICT (name) DO UPDATE
			SET
				hash=md5($2),
				content=$2,
				updated=NOW()
			RETURNING id;`,
			[pageConfig.id, content]
		)

		console.log(`[${config.slug}] 'Added page': '${pageConfig.remotePath}'`)
	}

	await transactionQuery(client, 'COMMIT')

	client.release()
}

import { DocereDB } from './docere-db'
import { fetchSource, sourceIsXml } from './handle-source/fetch-source'

import { flattenPages, PartialStandoff } from '@docere/common'

import type { DocereConfig } from '@docere/common'
import { xml2standoff } from '../utils/xml2standoff'
import { getSourceIdFromRemoteFilePath } from './handle-source/get-source-id-from-file-path'

export async function addPagesToDb(config: DocereConfig) {
	const db = new DocereDB(config.slug)
	await db.init()

	await db.begin()

	for (const pageConfig of flattenPages(config)) {
		const filePath = `/${config.slug}/${pageConfig.remotePath}`
		const content = await fetchSource(filePath, config)

		if (content == null) {
			console.log(`[${config.slug}] Page not found: ${pageConfig.remotePath}`)
			continue
		}

		let partialStandoff: PartialStandoff
		if (sourceIsXml(content, config)) {
			partialStandoff = await xml2standoff(content)
		}


		const pageId = getSourceIdFromRemoteFilePath(filePath, config, true)
		await db.insertPage(pageId, JSON.stringify(partialStandoff))

		console.log(`[${config.slug}] Added page: ${pageId}`)
	}

	await db.commit()
	db.release()
}

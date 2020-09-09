import React from 'react'
import { fetchPageXml, fetchPageConfig } from '../utils'

import type { DocereConfig, Page } from '../types'
import { ProjectContext } from '../context'

const pageCache = new Map<string, Page>()

async function getPage(id: string, config: DocereConfig): Promise<Page> {
	if (pageCache.has(id)) return pageCache.get(id)

	const doc = await fetchPageXml(config.slug, id)
	const pageConfig = await fetchPageConfig(config.slug, id)

	let parts: Map<string, Element>
	if (pageConfig.split != null) {
		parts = new Map()
		const partEls = doc.querySelectorAll(pageConfig.split.selector)
		for (const partEl of partEls) {
			const partId = pageConfig.split.extractId(partEl)
			parts.set(partId, partEl)
		}
	}

	pageCache.set(id, { ...pageConfig, doc, parts })
	return pageCache.get(id)
}

export function usePage(pageId: string) {
	const projectContext = React.useContext(ProjectContext)
	const [page, setPage] = React.useState<Page>(null)

	React.useEffect(() => {
		if (pageId == null) return
		getPage(pageId, projectContext.config).then(setPage)
	}, [pageId, projectContext.config.slug])

	return page	
}

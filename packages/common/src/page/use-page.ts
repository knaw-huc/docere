import React from 'react'
import { fetchPageXml } from '../utils'

import { ProjectContext } from '../project/context'

import type { Page } from './index'
import type { DocereConfig } from '../types/config-data/config'
import type { ID } from '../entry/layer'

const pageCache = new Map<string, Page>()

export async function fetchPage(id: ID, config: DocereConfig): Promise<Page> {
	if (pageCache.has(id)) return pageCache.get(id)

	const doc = await fetchPageXml(config.slug, id)
	const pageConfig = config.pages.find(p => p.id === id)

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

export function usePage(pageId: ID) {
	const projectContext = React.useContext(ProjectContext)
	const [page, setPage] = React.useState<Page>(null)

	React.useEffect(() => {
		if (pageId == null) return

		if (pageCache.has(pageId)) {
			setPage(pageCache.get(pageId))
		}
		else {
			fetchPage(pageId, projectContext.config).then(setPage)
		}
	}, [pageId, projectContext.config.slug])

	return page	
}

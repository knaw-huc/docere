import React from 'react'
import { fetchPageXml } from '../utils'

import { ProjectContext } from '../project/context'

import type { Page, PageConfig } from './index'
import { DocereConfig, isUrlMenuItem, UrlMenuItem } from '../config'
import type { ID } from '../entry/layer'
import { createPartialStandoffFromAnnotation, StandoffTree3 } from '..'

const pageCache = new Map<string, Page>()

export function flattenPages(config: DocereConfig) {
	const pages: PageConfig[] = []
	const addPage = (page: (PageConfig | UrlMenuItem)) => {
		if (isUrlMenuItem(page)) return
		pages.push(page)

		if (Array.isArray(page.children)) {
			page.children.forEach(p => addPage(p))
		}
	}

	config.pages?.config?.forEach(p => addPage(p))

	return pages
}

export async function fetchPage(id: ID, config: DocereConfig): Promise<Page> {
	if (pageCache.has(id)) return pageCache.get(id)

	const standoff = await fetchPageXml(config.slug, id)
	if (standoff == null) return null

	const pageConfig = flattenPages(config).find(p => p.id === id)
	let parts: Map<string, StandoffTree3>
	if (pageConfig.split != null) {
		parts = new Map()
		for (const annotation of standoff.annotations.filter(pageConfig.split.filter)) {
			const part = createPartialStandoffFromAnnotation(standoff, annotation)
			const partId = pageConfig.split.getId(annotation)
			parts.set(partId, new StandoffTree3(part))
		}
	}

	pageCache.set(id, { ...pageConfig, standoff: new StandoffTree3(standoff), parts })
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

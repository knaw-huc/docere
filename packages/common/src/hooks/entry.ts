import React from 'react'

import { getDefaultEntry, extractEntryData, extractParts } from '../puppenv.utils'
import { Entry, fetchEntryXml, ProjectContext, GetEntryProps, useUrlObject } from '..'

const entryCache = new Map<string, Entry>()

async function getEntry(props: Pick<GetEntryProps, 'id' | 'configData'>) {
	const entry = getDefaultEntry(props.id)
	entry.document = await fetchEntryXml(props.configData.config.slug, props.id)
	entry.element =  props.configData.prepareDocument(entry, props.configData.config)
	extractEntryData(entry, props.configData)
	extractParts(entry, props.configData)
	return entry
}

export function useEntry(id: string) {
	const projectContext = React.useContext(ProjectContext)
	const [entry, setEntry] = React.useState<Entry>(null)
	const { query } = useUrlObject()

	React.useEffect(() => {
		if (id == null || projectContext == null) return

		if (entryCache.has(id)) {
			const entry = entryCache.get(id)
			if (query.partId != null && entry.parts.has(query.partId))
				setEntry(entry.parts.get(query.partId))
			else
				setEntry(entry)
		} else {
			getEntry({ id, configData: projectContext.configData }).then(entry => {
				entryCache.set(entry.id, entry)
				if (query.partId != null && entry.parts.has(query.partId))
					setEntry(entry.parts.get(query.partId))
				else
					setEntry(entry)
			})
		}

	}, [id, query?.partId])

	return entry
}

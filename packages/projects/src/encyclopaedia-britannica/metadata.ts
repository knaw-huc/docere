import type { DocereConfig } from '@docere/common'

export default function extractMetadata(_doc: XMLDocument, config: DocereConfig, id: string) {
	const [setId, n] = id.split('/alto/')
	const set = config.data.sets.find((s: any) => s.setId === setId)
	set.n = n

	return set != null ? set : { n }
}

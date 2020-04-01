import type { DocereConfig } from '@docere/common'

export default function extractMetadata(_doc: XMLDocument, config: DocereConfig, id: string) {
	// const metadata: Metadata = {}

	const [setId] = id.split('/alto/')
	const set = config.data.sets.find((s: any) => s.setId === setId)

	return set != null ? set : {}
}

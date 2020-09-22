import type { DocereConfig, ConfigEntry } from '@docere/common'

export default function extractMetadata(entry: ConfigEntry, config: DocereConfig) {
	const [setId, n] = entry.id.split('/alto/')
	const set = config.data.sets.find((s: any) => s.setId === setId)
	set.n = n
	return set != null ? set : { n }
}

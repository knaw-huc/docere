import type { ExtractedMetadata, ConfigEntry } from '@docere/common';

export default function extractMetadata(entry: ConfigEntry) {
	// const metadata: ExtractedMetadata = {}

	const num = /\d+$/.exec(entry.id.replace(/\.jpg\.page$/, ''))
	return parseInt(num[0], 10)

	// return metadata
}

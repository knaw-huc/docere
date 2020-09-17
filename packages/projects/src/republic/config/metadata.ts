import type { ExtractedMetadata, Entry } from '@docere/common';

export default function extractMetadata(entry: Entry) {
	// const metadata: ExtractedMetadata = {}

	const num = /\d+$/.exec(entry.id.replace(/\.jpg\.page$/, ''))
	return parseInt(num[0], 10)

	// return metadata
}

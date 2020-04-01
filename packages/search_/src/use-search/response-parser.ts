import type { FSResponse, Hit } from '@docere/common';

export default function ESResponseParser(response: any): FSResponse {
	return {
		results: response.hits.hits
			.map((hit: any): Hit => ({
				id: hit._id,
				snippets: hit.highlight ? hit.highlight.text : [],
				...hit._source
			})),
		total: response.hits.total.value,
	}
}

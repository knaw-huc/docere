import { searchBaseUrl } from './search'

export default function useAutoSuggest(projectId: string) {
	const url = `${searchBaseUrl}${projectId}/_search`
	return async function autoSuggest(query: string) {
		const r = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				suggest: {
					mysuggest: {
						text: query,
						completion: {
							field: 'text_suggest',
							size: 10,
							skip_duplicates: true,
						}
					}
				}
			})
		})

		const json = await r.json()
		return json.suggest.mysuggest[0].options
			.map((s: any) => s.text)
			.filter((item: string, index: number, arr: string[]) => arr.indexOf(item) === index)
	}
}

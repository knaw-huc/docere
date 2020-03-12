export default async function fetchSearchResults(url: string, request: any) {
	let fetchResponse: Response
	let response: any

	try {
		fetchResponse = await fetch(url, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(request)
		})	
		response = await fetchResponse.json()
	} catch (err) {
		throw('Failed to fetched Faceted Search state')
	}
	
	return fetchResponse.status === 200 ? response : null
}

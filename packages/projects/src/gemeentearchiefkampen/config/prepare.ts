interface ElaborateSource {
	metadata: { field: string, value: string }[]
	paralleltexts: Record<string, { text: string, annotationData: any[] }>
}

export function prepareSource(elaborateSource: ElaborateSource): string {
	const metadata = elaborateSource.metadata.reduce( (prev: string, curr: any) =>
		`${prev}<item key="${curr.field}" value="${curr.value}"></item>`,
		''
	)

	const texts = Object.keys(elaborateSource.paralleltexts)
		.map(layerId => {
			const layer = elaborateSource.paralleltexts[layerId]
			let notes = ''
			if (Array.isArray(layer.annotationData)) {
				notes = `<notes>
					${layer.annotationData.map(ad =>
						`<note type="${ad.type.name}">
							${ad.text}
						</note>`
					).join('')}
				</notes>`
			}
			return `<div id="${layerId.toLowerCase()}">
				${layer.text.replace(/<br>/g, '<br />')}
				otes}
			</div>`
		})
		.join('')

	return `<root><metadata>${metadata}</metadata><text>${texts}</text></root>`
}

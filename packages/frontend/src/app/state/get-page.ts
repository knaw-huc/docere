import { fetchXml, getPageXmlPath } from '../../utils'

export default async function getPage(id: string, configData: DocereConfigData): Promise<Page> {
	// Flatten pages before using .find
	const pages = configData.config.pages.reduce((prev, curr) => {
		if (Array.isArray(curr.children)) prev.push(...curr.children)
		prev.push(curr)
		return prev
	}, [])

	const pageConfig = pages.find(p => p.id === id)

	const doc = await fetchXml(getPageXmlPath(this.props.configData.config.slug, pageConfig))

	return {
		...pageConfig,
		doc,
	}
}

import type { DocereConfig, DocereComponents } from '@docere/common'

export default function getComponents(config: DocereConfig) {
	return async function(): Promise<DocereComponents> {
		const init = (await import('./page')).default
		return init(config)
	}
}

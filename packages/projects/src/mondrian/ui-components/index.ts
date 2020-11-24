import { UIComponentType } from '@docere/common'
import { PagePartEntity, Note } from '@docere/text-components'

const uiComponentMapping: Record<string, React.FC<any>> = {
	editor: Note,
	bio: PagePartEntity,
	biblio: PagePartEntity,
}

export default function getUIComponents() {
	return async function(componentType: UIComponentType, id: string): Promise<React.FC<any>> {
		if (componentType === UIComponentType.Entity) {
			if (id === 'rkd-artwork-link') return (await import('./rkd-artwork')).default
			return uiComponentMapping[id]
		}
	}
}

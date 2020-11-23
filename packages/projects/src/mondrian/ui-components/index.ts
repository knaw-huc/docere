import { UIComponentType } from '@docere/common'
import { PagePartPopupBody } from '@docere/text-components'
import { NoteBody } from '@docere/text-components/build/note'

const uiComponentMapping: Record<string, React.FC<any>> = {
	editor: NoteBody,
	bio: PagePartPopupBody,
	biblio: PagePartPopupBody,
}

export default function getUIComponents() {
	return async function(componentType: UIComponentType, id: string): Promise<React.FC<any>> {
		if (componentType === UIComponentType.Entity) {
			if (id === 'rkd-artwork-link') return (await import('./rkd-artwork')).default
			return uiComponentMapping[id]
		}
	}
}

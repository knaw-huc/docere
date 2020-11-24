import { UIComponentType } from '@docere/common'
import { EntryLinkEntity, EntityWrapper } from '@docere/text-components'

export default function getUIComponents() {
	return async function(componentType: UIComponentType, id: string): Promise<React.FC<any>> {
		if (componentType === UIComponentType.SearchResult) return (await import('./search-result')).default
		if (componentType === UIComponentType.Entity) {
			if (id === 'entry-link') return EntryLinkEntity
			if (id === 'note-link') return EntryLinkEntity
			if (id === 'pers') return EntityWrapper
		}
	}
}

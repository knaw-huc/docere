import { UIComponentType } from '@docere/common'

export default function getUIComponents() {
	return async function(componentType: UIComponentType, _id: string): Promise<React.FC<any>> {
		if (componentType === UIComponentType.SearchResult) return (await import('./search-result')).default
	}
}

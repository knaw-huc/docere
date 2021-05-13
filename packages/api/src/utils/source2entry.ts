import { DocereConfig, StandoffWrapper } from '@docere/common'

/**
 * Create {@link PartialStandoff} from 'any' source
 * 
 * @param source 
 * @param projectConfig 
 * @returns 
 */
export function createStandoff(source: any, projectConfig: DocereConfig) {
	const standoff = projectConfig.standoff.prepareSource(source)

	console.log('scan', {...source.annotations.find(a => a.type === 'scan')})

	standoff.annotations.forEach(a => {
		const entityConfig = projectConfig.entities2.find(ec => ec.filter(a))
		if (entityConfig != null) {
			a.metadata._entityConfigId = entityConfig.id
			a.metadata._entityId = entityConfig.getId(a)
		}

		if (projectConfig.facsimiles.filter(a)) {
			a.metadata._facsimileId = projectConfig.facsimiles.getId(a)
			a.metadata._facsimilePath = projectConfig.facsimiles.getPath(a)
			// if (a.metadata._facsimilePath == null) console.log(a)
		}
	})

	

	const standoffWrapper = new StandoffWrapper(standoff)
	projectConfig.standoff.prepareAnnotations(standoffWrapper)

	return standoffWrapper.standoff
}

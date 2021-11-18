import type { ID } from './layer'
import { JsonEntry, Entry, Facsimile, isEntityAnnotation, isFacsimileAnnotation, EntityConfig } from './index'
import { isTextLayer } from '../utils'
import { DocereConfig } from '../config'
// import { EntityConfig } from './entity'

import { AnnotationLookup, StandoffTree3 } from '../standoff-annotations/annotation-tree3'
import { extendExportOptions, isPartialStandoff, PartialStandoffAnnotation } from '../standoff-annotations'

/**
 * Converts the serialized entry, which is stored in the database to 
 * the entry used in the client.
 * 
 * The main difference is that textData (entities, facsimiles) is added
 * 
 * @param entry - the serialized entry 
 * @return Entry - the deserialized entry, used in the client
 */
export function createEntry(entry: JsonEntry, config: DocereConfig): Entry {
	const t0 = performance.now()
	entry.layers
		.filter(isTextLayer)
		.forEach(tl => {
			const expopts = extendExportOptions(config.standoff.exportOptions)
			const sot = new StandoffTree3(tl.partialStandoff, expopts)

			// TODO move to preprocessing?
			const m = config.entities2.reduce<Map<string, number>>((prev, curr) => prev.set(curr.id, 1), new Map())
			sot.annotations
				.filter(isEntityAnnotation)
				.forEach(a => {
					const { entityConfigId } = a.props
					const order = m.get(entityConfigId)
					a.props.entityOrder = order
					m.set(entityConfigId, order + 1)
				})

			tl.standoffTree3 = sot
		})

	const t1 = performance.now(); console.log('Performance: ', `${t1 - t0}ms`)

	return ({
		...entry,
		metadata: Object.keys(entry.metadata).reduce((prev, curr) => {
			prev.set(curr, {
				config: config.metadata2.find(md => md.id === curr),
				value: entry.metadata[curr],
			})
			return prev
		}, new Map() as Entry['metadata']),
		textData: {
			entities: createEntityLookup(entry.layers, config),
			facsimiles: createFacsimileLookup(entry.layers)
		}
	})
}

function _createEntityLookup(annotations: PartialStandoffAnnotation[], entityConfigsById: Map<ID, EntityConfig>): AnnotationLookup {
	const lookup: AnnotationLookup = new Map()

	for (const annotation of annotations.filter(isEntityAnnotation)) {
		annotation.props.entityConfig = entityConfigsById.get(annotation.props.entityConfigId)
		lookup.set(annotation.props.entityId, annotation)
		if (isPartialStandoff(annotation.props.entityValue)) {
			const entities = _createEntityLookup(annotation.props.entityValue.annotations, entityConfigsById)

			for (const entity of entities.values()) {
				lookup.set(entity.props.entityId, entity)
			}
		}
	}

	return lookup
}

function createEntityLookup(layers: Entry['layers'], config: DocereConfig): AnnotationLookup {
	const entityConfigsById = config.entities2.reduce<Map<ID, EntityConfig>>((prev, curr) => {
		prev.set(curr.id, curr)
		return prev
	}, new Map())

	const initMap: AnnotationLookup = new Map()
	const lookup = layers
		.filter(isTextLayer)
		.reduce((prev, curr) => {
			return new Map([...prev, ..._createEntityLookup(curr.standoffTree3.annotations, entityConfigsById)])
		}, initMap)

	return lookup
}
// 	const entitiesById = new Map<ID, Entity>()
// 	const entityConfigsById = config.entities2.reduce<Map<ID, EntityConfig>>((prev, curr) => {
// 		prev.set(curr.id, curr)
// 		return prev
// 	}, new Map())

// 	layers
// 		.filter(isTextLayer)
// 		.forEach(textLayer => {

// 			textLayer.standoffTree3.annotations
// 				.filter(isEntityAnnotation)
// 				.forEach(annotation => {
// 					annotation.props.entityConfig = entityConfigsById.get(annotation.props.entityConfigId)

// 					// TODO generate area ID in preprocessing step?
// 					annotation.props.areas?.forEach(a => {
// 						if (a.id == null) a.id = generateId()
// 					})

// 					// TODO should be a Map<string, Annotation3[]>? There could be
// 					// more instances with the same entityId
// 					entitiesById.set(annotation.props.entityId, annotation)

// 				})
// 			// for (const annotation of textLayer.standoffTree3.lookup.values()) {//.annotations
// 			// 	if (isEntityAnnotation(annotation)) {
// 			// 		annotation.props.entityConfig = entityConfigsById.get(annotation.props.entityConfigId)

// 			// 		// TODO generate area ID in preprocessing step?
// 			// 		annotation.props.areas?.forEach(a => {
// 			// 			if (a.id == null) a.id = generateId()
// 			// 		})

// 			// 		// TODO should be a Map<string, Annotation3[]>? There could be
// 			// 		// more instances with the same entityId
// 			// 		entitiesById.set(annotation.props.entityId, annotation)
// 			// 	}
// 			// }
// 		})

// 	return entitiesById
// }

function createFacsimileLookup(layers: Entry['layers']): Map<ID, Facsimile> {
	const facsimiles = new Map<ID, Facsimile>()

	layers
		.filter(isTextLayer)
		.forEach(textLayer => {
			for (const annotation of textLayer.standoffTree3.annotations) {
				if (isFacsimileAnnotation(annotation)) {
					facsimiles.set(annotation.props.facsimileId, annotation)
				}
			}
		})

	return facsimiles
}

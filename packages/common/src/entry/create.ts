import type { ID } from './layer'
import { JsonEntry, Entry, Entity, Facsimile, isEntityAnnotation, isFacsimileAnnotation } from './index'
import { generateId, isTextLayer } from '../utils'
import { DocereConfig } from '../config'
import { EntityConfig } from './entity'

import { StandoffTree3 } from '../standoff-annotations/annotation-tree3'
import { extendExportOptions } from '../standoff-annotations'

/**
 * Converts the serialized entry, which is stored in the database to 
 * the entry used in the client.
 * 
 * The main difference is that textData (entities, facsimiles) is added
 * 
 * @param entry - the serialized entry 
 * @return Entry - the deserialized entry, used in the client
 * @todo fix the type errors on the layer conversion
 */
export function createEntry(entry: JsonEntry, config: DocereConfig): Entry {
	const t0 = performance.now()
	entry.layers
		.filter(isTextLayer)
		.forEach(tl => {
			const expopts = extendExportOptions(config.standoff.exportOptions)
			const sot = new StandoffTree3(tl.partialStandoff, expopts)
			tl.standoffTree3 = sot
		})
	const t1 = performance.now(); console.log('Performance: ', `${t1 - t0}ms`)

	return ({
		...entry,
		metadata: entry.metadata.reduce((prev, curr) => {
			prev.set(curr.config.id, curr)
			return prev
		}, new Map()),
		textData: {
			entities: createEntityLookup(entry.layers, config),
			facsimiles: createFacsimileLookup(entry.layers)
		}
	})
}

function createEntityLookup(layers: Entry['layers'], config: DocereConfig): Map<ID, Entity> {
	const entitiesById = new Map<ID, Entity>()
	const entityConfigsById = config.entities2.reduce<Map<ID, EntityConfig>>((prev, curr) => {
		prev.set(curr.id, curr)
		return prev
	}, new Map())

	layers
		.filter(isTextLayer)
		.forEach(textLayer => {
			for (const annotation of textLayer.standoffTree3.lookup.values()) {//.annotations
				if (isEntityAnnotation(annotation)) {
					annotation.props.entityConfig = entityConfigsById.get(annotation.props.entityConfigId)

					// TODO generate area ID in preprocessing step?
					annotation.props.areas?.forEach(a => {
						if (a.id == null) a.id = generateId()
					})

					// TODO should be a Map<string, Annotation3[]>? There could be
					// more instances with the samen entityId
					entitiesById.set(annotation.props.entityId, annotation)
				}
			}
		})

	return entitiesById
}

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

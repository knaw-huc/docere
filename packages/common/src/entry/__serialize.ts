// import { ExtractedEntry, SerializedEntry, serializeLayer } from '.'
// import { DocereConfig, Entity, defaultEntity } from '..'
// import { xmlToString } from '../utils'

// export type SerializeEntry = (entry: ExtractedEntry, config: DocereConfig) => SerializedEntry
// export function serializeEntry(entry: ExtractedEntry, config: DocereConfig): SerializedEntry {
// 	return {
// 		content: xmlToString(entry.document),
// 		id: entry.id,
// 		layers: entry.layers.map(serializeLayer(config)),
// 		metadata: entry.metadata,
// 		parts: Array.from(entry.parts || []).map((part =>
// 			serializeEntry(part[1], config))
// 		),
// 		plainText: config.plainText(entry, config),
// 		textData: {
// 			entities: entry.entities.map(e => {
// 				const { anchor, ...entityRest } = e
// 				const entity: Entity = {
// 					...defaultEntity,
// 					...entityRest
// 				}
// 				return [e.id, entity]
// 			}),
// 			facsimiles: entry.facsimiles.map(f => ([f.id, f]))
// 		}
// 	}
// }

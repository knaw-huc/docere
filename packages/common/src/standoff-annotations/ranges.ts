import { AnnotationNode } from '../../../common/src'

export class Ranges {
	private rangeById: Map<string, { startNode: AnnotationNode, endNode: AnnotationNode }[]> = new Map()
	private rangesByStartNode: Map<AnnotationNode, Set<string>> = new Map()

	get size() {
		return this.rangeById.size
	}

	add(ids: string | string[], startNode: AnnotationNode, endNode: AnnotationNode) {
		if (!Array.isArray(ids)) ids = [ids]

		ids.forEach(id => {
			if (this.rangeById.has(id)) {
				this.rangeById.set(id, this.rangeById.get(id).concat({ startNode, endNode }))
			} else {
				this.rangeById.set(id, [{ startNode, endNode }])
			}

			if (this.rangesByStartNode.has(startNode)) {
				this.rangesByStartNode.set(startNode, this.rangesByStartNode.get(startNode).add(id))
			} else {
				this.rangesByStartNode.set(startNode, new Set([id]))
			}
		})
	}

	remove(id: string) {
		this.rangeById.delete(id)

		for(const [startNode, ids] of this.rangesByStartNode) {
			if (ids.has(id)) {
				ids.delete(id)
				if (!ids.size) this.rangesByStartNode.delete(startNode)
				else this.rangesByStartNode.set(startNode, ids)
			}
		}
	}

	has(id: string | AnnotationNode) {
		return typeof id === 'string' ?
			this.rangeById.has(id) :
			this.rangesByStartNode.has(id)
	}

	*all(): Generator<[string, AnnotationNode, AnnotationNode]> {
		for (const [id, pairs] of this.rangeById) {
			for (const { startNode, endNode } of pairs) {
				yield [id, startNode, endNode]
			}
		}
	}
}

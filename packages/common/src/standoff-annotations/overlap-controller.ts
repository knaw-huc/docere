import { StandoffTree } from "./annotation-tree"
import { ExportOptions, OverlapReport, StandoffAnnotation } from "."
import { hasOverlap, sortByOffset } from "./utils"

export class OverlapController {
	constructor(private tree: StandoffTree) {}

	report() {
		const report: OverlapReport = []
		const listLength = this.tree.list.length

		for (let i = 0; i < listLength; i++) {
			const a_i = this.tree.atIndex(i)

			for (let j = i + 1; j < listLength; j++) {
				const a_j = this.tree.atIndex(j)
				if (a_j.start > a_i.end) break

				if (hasOverlap(a_i, a_j)) report.push([a_i, a_j])
			}
		}

		return report	
	}

	resolve() {
		let overlap = this.findFirstOverlap()

		while (overlap !== undefined) {
			this.resolveOverlap(overlap[0], overlap[1], this.tree.options)
			overlap = this.findFirstOverlap()
		}
	}

	private resolveOverlap(annotation1: StandoffAnnotation, annotation2: StandoffAnnotation, options: ExportOptions) {
		const x = [annotation1, annotation2]
		x.sort(sortByOffset(options))
		const [x1, x2] = x

		this.tree.split(x2,
			x1.start > x2.start ?
				x1.start :
				x1.end
		)
	}

	private findFirstOverlap(): [StandoffAnnotation, StandoffAnnotation] {
		const listLength = this.tree.list.length

		for (let i = 0; i < listLength; i++) {
			const a_i = this.tree.atIndex(i)

			for (let j = i + 1; j < listLength; j++) {
				const a_j = this.tree.atIndex(j)
				if (a_j.start > a_i.end) break
				if (hasOverlap(a_i, a_j)) return [a_i, a_j]
			}
		}
	}
}

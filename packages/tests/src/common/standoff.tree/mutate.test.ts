import { StandoffTree } from '../../../../common/src'

describe('[Common][StandoffTree] mutate annotations', () => {
	let tree: StandoffTree

	beforeAll(() => {
		tree = new StandoffTree(
			{ text: 'mytext', annotations: [], metadata: {} },
		)
	})

	it('should throw an error when trying to split the root', () => {
		expect(() => tree.split(tree.root, 2)).toThrowError("Can't split the root")
	})

	it('should add an annotation', () => {
		tree.add({ name: 'node', start: 0, end: 6 })
		expect(tree.exportXml()).toEqual('<root><node>mytext</node></root>')
	})

	it('should split an annotation', () => {
		tree.split(tree.list[1], 2)
		expect(tree.exportXml()).toEqual('<root><node>my</node><node>text</node></root>')
	})

	it('should remove an annotation', () => {
		tree.remove(tree.list[2])
		expect(tree.exportXml()).toEqual('<root><node>my</node>text</root>')
	})

	it('should convert an annotation to a milestone', () => {
		tree.convertToMilestone(tree.list[1])
		expect(tree.exportXml()).toEqual('<root><node/>mytext</root>')
	})
})

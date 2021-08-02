import { StandoffTree } from '../../../../common/src/standoff-annotations/annotation-tree'
import { xml2standoff } from '../../../../api/src/utils/xml2standoff'

import { AnnotationNode } from '../../../../common/src/standoff-annotations'
import { TEXT_NODE_NAME } from '../../../../api/node_modules/@docere/common/build'

const xml = `
	<root>
		text before
		<node n="1">
			first 
			<rangeStart target="xxx" themes="t.1 t.4"/>
			text 
			<rangeStart target="yyy" themes="t.3"/>
			between
		</node>
		<node n="2">
			second text between
		</node>
		<node n="3">
			third
			<rangeEnd key="xxx"/>
			text
			<rangeEnd key="yyy"/>
			between
		</node>
		text after
	</root>
`.trim()

let tree: StandoffTree
let rangeStartXXX: AnnotationNode
let rangeEndXXX: AnnotationNode
let rangeStartYYY: AnnotationNode
let node2: AnnotationNode
let node3: AnnotationNode

beforeAll(async () => {
	const standoff = await xml2standoff(xml)
	tree = new StandoffTree(standoff)

	rangeStartXXX = tree.find(a => a.name === 'rangeStart' && a.metadata.target === 'xxx')
	rangeEndXXX = tree.find(a => a.name === 'rangeEnd' && a.metadata.key === 'xxx')
	rangeStartYYY = tree.find(a => a.name === 'rangeStart' && a.metadata.target === 'yyy')
	node2 = tree.find(a => a.name === 'node' && a.metadata.n === '2')
	node3 = tree.find(a => a.name === 'node' && a.metadata.n === '3')
})

describe('[Common][StandoffTree] query', () => {
	it('Should getParents', () => {
		const parents = tree.getParents(rangeStartXXX)
		expect(parents.map(p => p.name)).toEqual(['node', 'root'])
	})

	it('Should findParent', () => {
		const parent = tree.findParent(rangeStartXXX, a => a.name === 'root')
		expect(parent.name).toEqual('root')
	})

	it('Should find rangeStart[target="yyy"] before node[n=3]', () => {
		const rangeStart = tree.findBefore(
			node3,
			a => a.name === 'rangeStart'
		)

		expect(rangeStart.metadata.target).toEqual('yyy')
	})

	it('Should not find root before node[n=3]', () => {
		const notFoundRoot = tree.findBefore(
			node3,
			a => a.name === 'root'
		)

		expect(notFoundRoot).toBeNull()
	})

	it('Should find node[n=3] after node[n=2]', () => {
		const _node3 = tree.findAfter(
			node2,
			a => a.name === 'node' && a.metadata.n === '3'
		)

		expect(_node3).toEqual(node3)
	})

	it('Should not find root after node[n=3]', () => {
		const notFoundRoot = tree.findAfter(
			node3,
			a => a.name === 'root'
		)

		expect(notFoundRoot).toBeNull()
	})

	it('Should return 8 annotation children and 10 text node children for root', () => {
		const children = tree.getChildren(tree.root)
		expect(children.filter(c => c.name === TEXT_NODE_NAME)).toHaveLength(10)
		expect(children.filter(c => c.name !== TEXT_NODE_NAME)).toHaveLength(7)
	})

	it('Should return 2 annotation children and 3 text node children for node[n=3]', () => {
		const children = tree.getChildren(node3)
		expect(children.filter(c => c.name === TEXT_NODE_NAME)).toHaveLength(3)
		expect(children.filter(c => c.name !== TEXT_NODE_NAME)).toHaveLength(2)
	})

	it('Should get next sibling', () => {
		expect(tree.getNextSibling(node2)).toEqual(node3)
		expect(tree.getNextSibling(rangeStartXXX)).toEqual(rangeStartYYY)
	})

	it('Should get previous sibling', () => {
		expect(tree.getPreviousSibling(node3)).toEqual(node2)
		expect(tree.getPreviousSibling(rangeStartYYY)).toEqual(rangeStartXXX)
	})

	it('Should get text content', () => {
		const textContent = tree.getTextContent(node2)
		expect(textContent).toEqual('\n\t\t\tsecond text between\n\t\t')
	})

	it('should check isChild', () => {
		expect(tree['isChild'](node2, tree.root)).toBeTruthy()
		expect(tree['isChild'](tree.root, node2)).toBeFalsy()

		expect(tree['isChild'](rangeStartYYY, tree.root)).toBeTruthy()
		expect(tree['isChild'](tree.root, rangeStartYYY)).toBeFalsy()

		expect(tree['isChild'](rangeEndXXX, node3)).toBeTruthy()
		expect(tree['isChild'](node3, rangeEndXXX)).toBeFalsy()

		expect(tree['isChild'](node2, node3)).toBeFalsy()
		expect(tree['isChild'](node3, node2)).toBeFalsy()
	})
})

describe('[Common][StandoffTree] export', () => {
	it('Should export correct XML', () => {
		expect(tree.exportXml()).toEqual(xml)
	})
})

describe('[Common][StandoffTree] walker', () => {
	it('should walk the tree', () => {
		expect(Array.from(tree.walker()).map(x => x.name)).toEqual(
			[
				'root',
				TEXT_NODE_NAME,
				'node',
				TEXT_NODE_NAME,
				'rangeStart',
				TEXT_NODE_NAME,
				'rangeStart',
				TEXT_NODE_NAME,
				TEXT_NODE_NAME,
				'node',
				TEXT_NODE_NAME,
				'node',
				TEXT_NODE_NAME,
				'rangeEnd',
				TEXT_NODE_NAME,
				'rangeEnd',
				TEXT_NODE_NAME,
				TEXT_NODE_NAME,
			]
		)
	})
})

describe('[Common][StandoffTree] ranges xyz', () => {
	it('should add a range', () => {
		tree.addRange(rangeStartXXX, rangeEndXXX)
		expect(tree['ranges'].has(rangeStartXXX)).toBeTruthy()
	})

	it('should use the start nodes ID as the range ID if getId is null', () => {
		expect(tree['ranges'].has(rangeStartXXX.id)).toBeTruthy()
		expect(tree['ranges'].size).toEqual(1)
	})

	it('should remove a range', () => {
		tree.removeRange(rangeStartXXX.id)
		expect(tree['ranges'].size).toEqual(0)
	})

	it('should use getId for the range ID', () => {
		tree.addRange(rangeStartXXX, rangeEndXXX, (a) => a.metadata.themes.split(' '))
		expect(tree['ranges'].has('t.1')).toBeTruthy()
		expect(tree['ranges'].has('t.4')).toBeTruthy()
		expect(tree['ranges'].size).toEqual(2)
	})

	it('should remove range t.1', () => {
		tree.removeRange('t.1')
		expect(tree['ranges'].size).toEqual(1)
	})

	it('should remove range t.4', () => {
		tree.removeRange('t.4')
		expect(tree['ranges'].size).toEqual(0)
	})

	it('should add a range by filter functions', () => {
		tree.addRange(
			a => a.name === 'rangeStart',
			a => b => a.metadata.target === b.metadata.key,
			(a, _b) => a.metadata.themes.split(' ')
		)

		expect(tree['ranges'].size).toEqual(3)
	})

	it('should add the ranges to the tree', () => {
		expect(rangeStartYYY.metadata._range.has('t.1')).toBeTruthy()
		expect(rangeStartYYY.metadata._range.has('t.4')).toBeTruthy()
		expect(rangeStartYYY.metadata._range.has('t.3')).toBeFalsy()

		expect(node2.metadata._range.has('t.1')).toBeTruthy()
		expect(node2.metadata._range.has('t.4')).toBeTruthy()
		expect(node2.metadata._range.has('t.3')).toBeTruthy()

		expect(rangeEndXXX.metadata._range.has('t.1')).toBeFalsy()
		expect(rangeEndXXX.metadata._range.has('t.4')).toBeFalsy()
		expect(rangeEndXXX.metadata._range.has('t.3')).toBeTruthy()

		expect(node3.metadata._range?.has('t.1')).toBeFalsy()
		expect(node3.metadata._range?.has('t.4')).toBeFalsy()
		expect(node3.metadata._range?.has('t.3')).toBeFalsy()
	})
})

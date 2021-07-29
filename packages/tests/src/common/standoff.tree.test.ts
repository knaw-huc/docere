import { StandoffTree } from '../../../common/src/standoff-annotations/annotation-tree'
import { xml2standoff } from '../../../api/src/utils/xml2standoff'

import type { ExportOptions, StandoffAnnotation } from '../../../common/src/standoff-annotations'
import { sortByOffset } from '../../../api/node_modules/@docere/common/build'
import { extendExportOptions } from '../../../api/node_modules/@docere/common/build'
import { extendStandoffAnnotation } from '../../../api/node_modules/@docere/common/build'

export const xml = `
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

describe('[Common][StandoffTree] default', () => {
	let tree: StandoffTree
	let rangeStartXXX: StandoffAnnotation
	let rangeStartYYY: StandoffAnnotation
	let node1: StandoffAnnotation
	let node2: StandoffAnnotation
	let node3: StandoffAnnotation

	beforeAll(async () => {
		const standoff = await xml2standoff(xml)
		tree = new StandoffTree(standoff, { metadata: { addId: false } })

		rangeStartXXX = tree.annotations.find(a => a.name === 'rangeStart' && a.metadata.target === 'xxx')
		rangeStartYYY = tree.annotations.find(a => a.name === 'rangeStart' && a.metadata.target === 'yyy')
		node1 = tree.annotations.find(a => a.name === 'node' && a.metadata.n === '1')
		node2 = tree.annotations.find(a => a.name === 'node' && a.metadata.n === '2')
		node3 = tree.annotations.find(a => a.name === 'node' && a.metadata.n === '3')
	})

	it('Should getParents', () => {
		const parents = tree.getParents(rangeStartXXX)
		expect(parents.map(p => p.name)).toEqual(['root', 'node'])
	})

	it('Should getDirectParent node[n=1]', () => {
		const directParent = tree.getDirectParent(rangeStartXXX)
		expect(directParent.metadata.n).toEqual('1')
	})

	it('Should getDirectParent root', () => {
		const parentRoot = tree.getDirectParent(node1)
		expect(parentRoot.name).toEqual('root')
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

	it('Should return 2 children for node[n=3]', () => {
		const children = tree.getChildren(node3)
		expect(children).toHaveLength(2)
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

	it('Should export correct XML', () => {
		expect(tree.exportXml()).toEqual(xml)
	})
})

const standoff = {
	metadata: {},
	annotations: [
		{
			end: 32,
			name: 'root',
			start: 0
		},
		{
			end: 10,
			name: 'node',
			start: 5
		},
		{
			end: 16,
			name: 'node',
			start: 10
		}
	],
	text: "It's spitsbergen all over again."

}

const xml2 = `<root>It's <node>spits</node><node>bergen</node> all over again.</root>`
const xml2result = `<root>It's <node>spits<test/></node><node>bergen</node> all over again.</root>`

describe('[Common][StandoffTree] add milestone', () => {
	let treeFromXml: StandoffTree
	let treeFromStandoff: StandoffTree

	beforeAll(async () => {
		const standoffFromXml = await xml2standoff(xml2)
		treeFromXml = new StandoffTree(
			standoffFromXml,
			{
				annotationHierarchy: ['test', 'node'],
				metadata: {
					addId: false
				}
			},
			false
		)

		treeFromStandoff = new StandoffTree(
			standoff,
			{
				annotationHierarchy: ['test', 'node'],
				metadata: {
					addId: false
				}
			},
			false
		)
		treeFromStandoff
	})

	it('Should export correct XML from XML source', () => {
		treeFromXml.add({
			start: 10,
			name: 'test',
		})

		expect(treeFromXml.exportXml()).toEqual(xml2result)
	})

	it('Should export correct XML from Standoff source', () => {
		treeFromStandoff.add({
			start: 10,
			name: 'test',
		})

		expect(treeFromStandoff.exportXml()).toEqual(xml2result)
	})
})

describe('[Common][StandoffTree] sortByOffset', () => {
	let annotationsInit: StandoffAnnotation[]
	let annotations: StandoffAnnotation[]
	let exportOptions: ExportOptions

	beforeAll(() => {
		annotationsInit = [
			{ start: 12, name: 'end' },
			{ start: 8, end: 12, name: 'first' },
			{ start: 8, end: 12, name: 'second' },
			{ start: 8, end: 12, name: 'third' },
			{ start: 8, name: 'start' }
		].map(extendStandoffAnnotation)

		exportOptions = extendExportOptions({})
	})

	beforeEach(() => {
		annotations = JSON.parse(JSON.stringify(annotationsInit))
	})

	it('should sort on start offset', () => {
		annotations.sort(sortByOffset(exportOptions))
		expect(annotations.map(a => a.name)).toEqual(['start', 'first', 'second', 'third', 'end'])
	})

	it('should sort on annotation hierarchy', () => {
		exportOptions.annotationHierarchy = ['second', 'first']
		annotations.sort(sortByOffset(exportOptions))
		expect(annotations.slice(1, 3).map(a => a.name)).toEqual(['second', 'first'])
	})

	it('Should sort on annotation hierarchy, with milestone', () => {
		exportOptions.annotationHierarchy = ['first', 'start']
		annotations.sort(sortByOffset(exportOptions))
		expect(annotations.slice(0, 2).map(a => a.name)).toEqual(['first', 'start'])
	})
})

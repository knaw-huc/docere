import { xml2standoff } from '../../../../api/src/utils/xml2standoff'
import { PartialStandoff, StandoffTree } from '../../../../common/src'

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
	let standoffFromXml: PartialStandoff

	beforeAll(async () => {
		standoffFromXml = await xml2standoff(xml2)
	})

	beforeEach(() => {
		treeFromXml = new StandoffTree(
			standoffFromXml,
			{
				annotationHierarchy: ['test', 'node'],
				metadata: {
					addId: false
				}
			}
		)

		treeFromStandoff = new StandoffTree(
			standoff,
			{
				annotationHierarchy: ['test', 'node'],
				metadata: {
					addId: false
				}
			}
		)
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


	/**
	 * After adding the <test/> tag to the first <node> tag, the _textContent
	 * metadata moves from the <node> tag to a child
	 */
	it('should not double _textContent', () => {
		expect(treeFromStandoff.list[1].metadata._textContent).toEqual('spits')
		expect(treeFromStandoff.root.children[1].metadata._textContent).toEqual('spits')


		treeFromStandoff.add({
			start: 10,
			name: 'test',
		})

		expect(treeFromStandoff.list[1].metadata._textContent).toBeUndefined()
		expect(treeFromStandoff.root.children[1].metadata._textContent).toBeUndefined()
	})
})

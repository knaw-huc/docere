import { AnnotationNode, ExportOptions, extendExportOptions, sortByOffset, toAnnotationNode } from '../../../../common/src'

describe('[Common][StandoffTree] sortByOffset', () => {
	let annotationsInit: AnnotationNode[]
	let annotations: AnnotationNode[]
	let exportOptions: ExportOptions

	beforeAll(() => {
		annotationsInit = [
			{ start: 12, name: 'end' },
			{ start: 8, end: 12, name: 'first' },
			{ start: 8, end: 12, name: 'second' },
			{ start: 8, end: 12, name: 'third' },
			{ start: 8, name: 'start' }
		].map(toAnnotationNode)

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

describe('[Common][StandoffTree] sortByOffset 2', () => {
	let annotationsInit: AnnotationNode[]
	let annotations: AnnotationNode[]
	let exportOptions: ExportOptions

	beforeAll(() => {
		annotationsInit = [
			{ start: 0, end: 6, name: 'root', metadata: { _isRoot: true } },
			{ start: 0, name: 'milestone' },
		].map(toAnnotationNode)

		exportOptions = extendExportOptions({})
	})

	beforeEach(() => {
		annotations = JSON.parse(JSON.stringify(annotationsInit))
	})

	it('should keep root before milestone', () => {
		annotations.sort(sortByOffset(exportOptions))
		expect(annotations.map(a => a.name)).toEqual(['root', 'milestone'])
	})
})

import { ExportOptions, extendExportOptions, PartialStandoffAnnotation, StandoffTree3 } from '../../../../common/src'

describe('[Common][StandoffTree] sortByOffset', () => {
	let annotationsInit: PartialStandoffAnnotation[]
	let standoffTree: StandoffTree3
	let exportOptions: ExportOptions

	beforeAll(() => {
		annotationsInit = [
			{ start: 12, name: 'end' },
			{ start: 8, end: 12, name: 'first' },
			{ start: 8, end: 12, name: 'second' },
			{ start: 8, end: 12, name: 'third' },
			{ start: 8, name: 'start' }
		]

		exportOptions = extendExportOptions({})
	})

	it('should sort on start offset', () => {
		standoffTree = new StandoffTree3({ metadata: {}, text: '012345678910', annotations: annotationsInit}, exportOptions)
		expect(standoffTree.annotations.slice(1).map(a => a.name)).toEqual(['start', 'first', 'second', 'third', 'end'])
	})

	it('should sort on annotation hierarchy', () => {
		exportOptions.annotationHierarchy = ['second', 'first']
		standoffTree = new StandoffTree3({ metadata: {}, text: '012345678910', annotations: annotationsInit}, exportOptions)
		expect(standoffTree.annotations.slice(2, 4).map(a => a.name)).toEqual(['second', 'first'])
	})

	it('Should sort on annotation hierarchy, with milestone', () => {
		exportOptions.annotationHierarchy = ['first', 'start']
		standoffTree = new StandoffTree3({ metadata: {}, text: '012345678910', annotations: annotationsInit}, exportOptions)
		expect(standoffTree.annotations.slice(1, 3).map(a => a.name)).toEqual(['first', 'start'])
	})
})

describe('[Common][StandoffTree] keep root before milestone', () => {
	const exportOptions = extendExportOptions({})

	it('should keep root before milestone', () => {
		const standoffTree = new StandoffTree3({ metadata: {}, text: '012345', annotations: [
			{ start: 0, end: 6, name: 'root' },
			{ start: 0, name: 'milestone' },
		]}, exportOptions)
		// annotations.sort(sortByOffset(exportOptions))
		expect(standoffTree.annotations.map(a => a.name)).toEqual(['root', 'milestone'])
	})
})

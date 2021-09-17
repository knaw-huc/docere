import { FacsimileArea, PartialStandoff, PartialStandoffAnnotation, TagShape, isChild } from '@docere/common'

interface RepublicAnnotation {
	end_offset: number
	id: string
	metadata: Record<string, any>
	start_offset: number
	type: string
	coords?: [string, string][]
}

function toDocereAnnotation(annotation: RepublicAnnotation): PartialStandoffAnnotation {
	if (annotation.metadata == null) annotation.metadata = {}

	delete annotation.metadata.parent_id
	delete annotation.metadata.source_id
	delete annotation.metadata.num_lines
	delete annotation.metadata.num_words
	delete annotation.metadata.num_paragraphs
	delete annotation.metadata.num_columns
	delete annotation.metadata.session_date
	delete annotation.metadata.session_id
	delete annotation.metadata.inventory_num

	return {
		end: annotation.end_offset,
		id: annotation.id,
		name: annotation.metadata.type || annotation.type,
		props: {},
		sourceProps: {
			...annotation.metadata,
			coords: annotation.coords
		},
		start: annotation.start_offset,
	}
}

function prepareAnnotations(partialStandoff: PartialStandoff) {
	return function (annotation: PartialStandoffAnnotation): PartialStandoffAnnotation {
		if (annotation.name === 'line') {
			annotation.props.areas = [createFacsimileArea(annotation)]
		}

		if (annotation.name === 'line' || annotation.name === 'scan') {
			convertToMilestone(annotation)
		}

		if (annotation.name === 'attendance_list' || annotation.name === 'resolution') {
			annotation.props.areas = partialStandoff.annotations
				.filter(a => a.name === 'text_region' && isChild(a, annotation))
				.map(createFacsimileArea)
		}

		return annotation
	}
}

interface RepublicStandoff extends Omit<PartialStandoff, 'annotations'> {
	annotations: RepublicAnnotation[]
}

export function prepareSource(republicStandoff: RepublicStandoff): PartialStandoff {
	republicStandoff.metadata.resolution_ids = republicStandoff.annotations
		.filter(a => a.metadata.type === 'resolution')
		.map(a => a.metadata.id)

	const partialStandoff = {
		metadata: republicStandoff.metadata,
		text: republicStandoff.text,
		annotations: republicStandoff.annotations
			.map(toDocereAnnotation)
			.filter(a => !(a.name === 'attendant' && a.sourceProps.delegate_id === 0))
	}

	partialStandoff.annotations = partialStandoff.annotations
		.map(prepareAnnotations(partialStandoff))
		.map(a => {
			delete a.sourceProps.coords
			return a
		})

	return partialStandoff
}

function createFacsimileArea(textRegion: PartialStandoffAnnotation): FacsimileArea {
	return {
		facsimileId: textRegion.sourceProps.scan_id,
		points: textRegion.sourceProps.coords
	}
}

function convertToMilestone(annotation: PartialStandoffAnnotation) {
	annotation.end = annotation.start
	annotation.tagShape = TagShape.SelfClosing
	return annotation
}

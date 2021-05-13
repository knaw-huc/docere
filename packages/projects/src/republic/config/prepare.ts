import { FacsimileArea, PartialStandoff, PartialStandoffAnnotation, Standoff, StandoffWrapper } from '@docere/common'

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

	if (annotation.coords != null) {
		annotation.metadata.coords = annotation.coords
	}

	// if (annotation.type === 'scan') {
	// 	annotation.metadata = {
	// 		_facsimileId: annotation.id,
	// 		_facsimilePath: annotation.metadata.iiif_info_url
	// 	}
	// }

	return {
		end: annotation.end_offset,
		id: annotation.id,
		metadata: annotation.metadata,
		name: annotation.type,
		start: annotation.start_offset,
	}
}

interface RepublicStandoff extends Omit<Standoff, 'annotations'> {
	annotations: RepublicAnnotation[]
}

export function prepareSource(republicStandoff: RepublicStandoff): PartialStandoff {
	return {
		metadata: republicStandoff.metadata,
		text: republicStandoff.text,
		annotations: republicStandoff.annotations.map(toDocereAnnotation)
	}
}

function createFacsimileArea(textRegion: PartialStandoffAnnotation): FacsimileArea {
	return {
		facsimileId: textRegion.metadata.scan_id,
		points: textRegion.metadata.coords
	}
}

export function prepareAnnotations(standoff: StandoffWrapper<PartialStandoffAnnotation>) {
	standoff.convertToMilestone(a => a.name === 'line', true)
	standoff.convertToMilestone(a => a.name === 'scan')

	standoff.annotations
		.filter(a => a.name === 'attendance_list' || a.name === 'resolution')
		.forEach(parent => {
			const textRegions = standoff
				.getChildren(parent, a => a.name === 'text_region')

			parent.metadata._areas = textRegions.map(createFacsimileArea)
		})

	standoff.annotations
		.filter(a => a.name === 'line')
		.forEach(a => {
			a.metadata._areas = [createFacsimileArea(a)]
		})
}

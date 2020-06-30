import { Note, Colors } from '@docere/common';

function toExtractedNote(el: Element): Note {
	return {
		color: Colors.BlueBright,
		el,
		id: el.getAttribute('xml:id'),
		// n: el.getAttribute('n'),
		n: '1',
		targetId: null,
		title: 'Note',
		type: null,
	}
}
export default function extractNotes(doc: XMLDocument) {
	return Array.from(doc.querySelectorAll('div[type="notes"] > note'))
		.map(toExtractedNote)
}

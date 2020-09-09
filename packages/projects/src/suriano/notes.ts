import { Note, Colors } from '@docere/common';

function toExtractedNote(el: Element): Note {
	return {
		color: Colors.BlueBright,
		el,
		id: el.getAttribute('corresp').slice(1),
		// n: el.getAttribute('n'),
		n: '*',
		targetId: null,
		title: 'Gloss',
		type: 'gloss',
	}
}
export default function extractNotes(doc: XMLDocument) {
	return Array.from(doc.querySelectorAll('gloss[corresp]'))
		.map(toExtractedNote)
}

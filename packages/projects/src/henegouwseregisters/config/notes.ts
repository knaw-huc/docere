import { Note, Colors } from '@docere/common';

function toExtractedNote(el: Element, index: number): Note {
	return {
		color: Colors.BlueBright,
		el: el.textContent,
		id: el.id,
		n: (index + 1).toString(),
		targetId: el.id,
		// title: 'SOME BULLSHIT',
		type: 'note',
	}
}
export default function extractNotes(doc: XMLDocument) {
	return Array.from(doc.querySelectorAll('note'))
			.map(toExtractedNote)
}

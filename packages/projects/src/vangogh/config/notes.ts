import { Note, Colors } from '@docere/common';

function toExtractedNote(el: Element): Note {
	return {
		// color: Colors.BlueBright,
		el,
		id: el.getAttribute('xml:id'),
		n: el.getAttribute('n'),
		targetId: el.getAttribute('n'),
		title: `Note ${el.getAttribute('n')}`,
		type: null,
	}
}
export default function extractNotes(doc: XMLDocument) {
	const textualNotes = Array.from(doc.querySelectorAll('div[type="textualNotes"] > note'))
			.map(toExtractedNote)
			.map(n => { n.type = 'textual'; return n })

	const editorNotes = Array.from(doc.querySelectorAll('div[type="notes"] > note'))
			.map(toExtractedNote)
			.map(n => { n.type = 'editor'; return n })
	
	return textualNotes.concat(editorNotes)
}

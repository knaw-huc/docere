import { LayerType, EntityType, Colors, extendConfigData, xmlToString, ExtractEntitiesProps } from '@docere/common'
import extractFacsimiles from './facsimiles'
import prepare from './prepare'
import metadata from './metadata'

const projectId = 'vangogh'

function extractNote({ layerElement, entry, entityConfig }: ExtractEntitiesProps) {
	return Array.from(layerElement.querySelectorAll(entityConfig.selector))
		.map(anchor => {
			const id = entityConfig.extractId(anchor)
			const n = anchor.getAttribute('n')
			const note = entry.document.querySelector(`note[target="#${id}"]`)
			if (note == null) return null
			return {
				anchor,
				content: xmlToString(note),
				n,
				title: `Note ${n}`,
			}
		})
		.filter(x => x != null)
}

export default extendConfigData({
	entities: [
		{
			color: Colors.BlueBright,
			extractId: el => el.getAttribute('xml:id'),
			extract: extractNote,
			id: 'textual',
			selector: 'div[type="original"] anchor',
			title: "Textual notes",
			type: EntityType.Note,
			showAsFacet: false,
		},
		{
			color: Colors.BlueBright,
			// TODO querySelectorAll the anchors (lb)
			extractId: el => el.getAttribute('xml:id'),
			extract: extractNote,
			id: 'editor',
			selector: 'div[type="translation"] anchor',
			title: "Editor notes",
			type: EntityType.Note,
		},
		{
			color: '#fd7a7a',
			extract: ({ layerElement, entityConfig }) => Array.from(layerElement.querySelectorAll(entityConfig.selector))
				.map(el => ({
					content: el.textContent,
					anchor: el,
				})),
			extractId: el => el.getAttribute('key'),
			id: 'pers',
			selector: 'rs[type="pers"]',
			showInAside: true,
			title: 'Persons',
			type: EntityType.Person,
		},
		{
			color: Colors.Orange,
			extract: ({ entityConfig, layerElement }) => Array.from(layerElement.querySelectorAll(entityConfig.selector))
				.map(el => ({
					anchor: el,
					content: el.textContent,
				})),
			extractId: el => el.getAttribute('target').replace(/\.xml$/, ''),
			id: 'entry-link',
			selector: 'ref[target][type="entry-link"]',
			type: EntityType.EntryLink,
		},
		{
			color: Colors.Brown,
			extract: ({ entityConfig, layerElement }) => Array.from(layerElement.querySelectorAll(entityConfig.selector))
				.map(el => ({
					anchor: el,
					content: el.textContent,
				})),
			extractId: el => el.getAttribute('target'),
			id: 'note-link',
			selector: 'ref[target][type="note-link"]',
			type: EntityType.NoteLink,
		},
	],
	facsimiles: {
		extractFacsimiles,
		extractFacsimileId: el => el.getAttribute('xml:id'),
		selector: 'facsimile zone',
	},
	layers: [
		{
			active: true,
			id: 'facsimile',
			type: LayerType.Facsimile,
		},
		{
			active: false,
			extractElement: entry => entry.document.querySelector('div[type="original"]'),
			id: 'original',
			type: LayerType.Text,
		},
		{
			active: true,
			extractElement: entry => entry.document.querySelector('div[type="translation"]'),
			id: 'translation',
			type: LayerType.Text,
		},
	],
	metadata,
	slug: projectId,
	title: 'Van Gogh Letters',
	prepare,
})

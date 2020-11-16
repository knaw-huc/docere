import styled from 'styled-components'
import { getNote, Pb, getEntity, Lb, EntryLinkPopupBody, NoteLinkPopupBody } from '@docere/text-components'
import { DocereComponentContainer, DocereConfig } from '@docere/common'

export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string) {
		return {
			ab: styled.div`margin-bottom: 1rem;`,
			anchor: getNote(props => props.attributes['docere:id']),
			lb: Lb,
			pb: Pb,
			'ref[target][type="entry-link"]': getEntity(EntryLinkPopupBody),
			'ref[target][type="note-link"]': getEntity(NoteLinkPopupBody),
			rs: getEntity()
		}
	}
}

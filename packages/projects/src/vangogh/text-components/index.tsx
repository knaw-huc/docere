import styled from 'styled-components'
import { NoteTag, Pb, EntityTag, Lb } from '@docere/text-components'
import { DocereComponentContainer, DocereConfig } from '@docere/common'

export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string) {
		return {
			ab: styled.div`margin-bottom: 1rem;`,
			anchor: NoteTag,
			lb: Lb,
			pb: Pb,
			'ref[target][type="entry-link"]': EntityTag,
			'ref[target][type="note-link"]': EntityTag,
			rs: EntityTag,
		}
	}
}

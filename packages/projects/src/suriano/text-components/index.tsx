import { DocereComponentContainer } from '@docere/common'
import type { DocereConfig } from '@docere/common'
import { Lb, Pb, NoteTag, EntityTag, Hi } from '@docere/text-components'
import { NoOp } from '../../utils'

export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string) {
		return {
			teiHeader: NoOp,
			'section.footnotes': NoOp,
			head: NoOp,
			header: NoOp,
			hi: Hi,
			// 'a.footnote-ref': Note,
			pb: Pb,
			lb: Lb,
			ptr: NoteTag,
			'rs[type="pers"]': EntityTag,
		}
	}
}

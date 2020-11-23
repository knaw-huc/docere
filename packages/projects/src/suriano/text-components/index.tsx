import { DocereComponentContainer } from '@docere/common'
import type { DocereConfig } from '@docere/common'
import { Note, Lb, Pb } from '@docere/text-components'
import { NoOp } from '../../utils'

export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string) {
		return {
			teiHeader: NoOp,
			'section.footnotes': NoOp,
			head: NoOp,
			header: NoOp,
			'a.footnote-ref': Note,
			// pb: getPb(props => props.attributes.id),
			pb: Pb,
			lb: Lb
		}
	}
}

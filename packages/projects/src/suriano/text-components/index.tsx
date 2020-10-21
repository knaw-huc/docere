import { DocereComponentContainer } from '@docere/common'
import type { DocereConfig } from '@docere/common'
import { getNote, getPb, Lb } from '@docere/text-components'
import { NoOp } from '../../utils'

export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string) {
		return {
			teiHeader: NoOp,
			'section.footnotes': NoOp,
			head: NoOp,
			header: NoOp,
			'a.footnote-ref': getNote(props => {
				return props.attributes.href.slice(1)
			}),
			pb: getPb(props => props.attributes.id),
			lb: Lb
		}
	}
}

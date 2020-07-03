import { getNote, getPb, Lb, Hi } from '@docere/text-components'
import type { DocereComponentContainer, DocereConfig } from '@docere/common'

export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string) {
		return {
			lb: Lb,
			pb: getPb(props => props.attributes.facs?.slice(1)),
			ptr: getNote(props => props.attributes.target.slice(1)),
			hi: Hi
		}
	}
}

import styled from 'styled-components'
import { RepublicLb, SessionPart } from './components'

import type { DocereConfig, DocereComponents } from '@docere/common'
import { EntityTag, Pb } from '@docere/text-components'

const Hi = styled.span`
	background-color: yellow;
`

export default function getComponents(_config: DocereConfig) {
	return async function(): Promise<DocereComponents> {
		return {
			'hilight-start': Hi,
			attendant: EntityTag,
			line: RepublicLb,
			scan: Pb,
			attendance_list: SessionPart,
			resolution: SessionPart,
			paragraph: styled.div`
				margin-bottom: 1rem;
			`,
		}
	}
}

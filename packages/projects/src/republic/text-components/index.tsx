import styled from 'styled-components'
import { RepublicLb, SessionPart } from './components'

import type { DocereConfig, DocereComponents } from '@docere/common'
import { EntityTag, Pb } from '@docere/text-components'

export default function getComponents(_config: DocereConfig) {
	return async function(): Promise<DocereComponents> {
		return {
			attendant: EntityTag,
			line: RepublicLb,
			scan: Pb,
			attendance_list: SessionPart,
			resolution: SessionPart,
			paragraph: styled.div`
				margin-bottom: 1rem;
			`
		}
	}
}

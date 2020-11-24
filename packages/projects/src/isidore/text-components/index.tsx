import styled from 'styled-components'
import { DocereComponentContainer } from '@docere/common'
import { Pb, Paragraph } from '@docere/text-components'

import type { DocereConfig } from '@docere/common'

export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string) {
		return {
			ab: Paragraph,
			head: styled.h3`
				margin: 0 0 2.25rem 0;
				padding: 0;
			`,
			pb: Pb,
			// 'gloss[corresp]': getEntity()
		}
	}
}

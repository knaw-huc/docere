import { DocereComponentContainer } from '@docere/common'
import type { DocereConfig, DocereComponents } from '@docere/common'
import styled from 'styled-components'

export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string): Promise<DocereComponents> {
		return {
			p: styled.p``,
		}
	}
}

import { DocereComponentContainer } from '@docere/common'
import type { DocereConfig, DocereComponents } from '@docere/common'
import { Pb } from '@docere/text-components'
import styled from 'styled-components'

export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string): Promise<DocereComponents> {
		const components2: DocereComponents = {
			pb: Pb,
			date: styled.div`font-weight: bold; font-size: 1.2rem;`,
			persons: styled.ul`
				font-size: .85rem;
				margin-bottom: 1rem;
				margin-top: -.5rem;

				li:after {
					content: ",";
				}

				li:last-of-type:after {
					content: '';
				}
			`,
			person: styled.li`
				display: inline-block;
				padding-left: .35rem;

				&:first-of-type {
					padding-left: 0;
				}
			`,
		}

		return components2
	}
}


import styled from 'styled-components'
import { ContainerType } from '@docere/common'
import type { DocereConfig, DocereComponents } from '@docere/common'
import { EntityTag } from '@docere/text-components'

// TODO move <w CONTENT="x"/> to <w>x</w>
export default function(_config: DocereConfig) {
	return async function(_container: ContainerType, _id: string): Promise<DocereComponents> {
		const components: DocereComponents = {
			head: styled.h3`
				font-size: 1.2em;
				margin: 0;
			`,
			p: styled.div`
				margin-bottom: 1em;

				${(props: any) => props._class === 'subheader' ?
					'font-size: 1.1em;' : ''
				}
			`,
			s: styled.div``,
			// w: w(config),
			w: EntityTag
		}
		return components
	}
}

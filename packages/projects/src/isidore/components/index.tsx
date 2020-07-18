// import * as React from 'react'
import { DocereComponentContainer } from '@docere/common'
import type { DocereConfig } from '@docere/common'
import { getPb, Paragraph, getEntity } from '@docere/text-components'
import styled from 'styled-components'

export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string) {
		return {
			ab: Paragraph,
			head: styled.h3`
				margin: 0 0 2.25rem 0;
				padding: 0;
			`,
			pb: getPb(props => props.attributes.corresp?.slice(1)),
			'gloss[corresp]': getEntity({
				extractKey: props => {
					console.log(props.attributes)
					return props.attributes.corresp.slice(1)
				}
			})
		}
	}
}

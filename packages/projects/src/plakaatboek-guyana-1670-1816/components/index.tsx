import React from 'react'
import { DocereComponentContainer, DocereComponentProps } from '@docere/common'
import type { DocereConfig, DocereComponents } from '@docere/common'
import styled from 'styled-components'
import { getPb, getNote } from '@docere/text-components'

function Transcriptie(props: DocereComponentProps) {
	if (props.entry.facsimiles == null) return null
	const Pb = getPb(() => props.entry.facsimiles.map(f => f.id))

	return (
		<div>
			<Pb {...props} />
			{props.children}
		</div>
	)
}

export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string): Promise<DocereComponents> {
		return {
			em: styled.em``,
			note: getNote(props => props.attributes.id),
			p: styled.div`margin-bottom: 1rem`,
			transcriptie: Transcriptie
		}
	}
}

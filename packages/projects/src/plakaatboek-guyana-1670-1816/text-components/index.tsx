import React from 'react'
import { DocereComponentContainer, DocereComponentProps, isFacsimileLayer } from '@docere/common'
import type { DocereConfig, DocereComponents } from '@docere/common'
import styled from 'styled-components'
import { getPb, getNote } from '@docere/text-components'

function Transcriptie(props: DocereComponentProps) {
	// This is overkill and only useful when generalised. Plakaatboek Guyana
	// only has 1 facsimile layer
	const Pb = getPb(() => {
		return props.entry.layers
			.filter(isFacsimileLayer)
			.reduce((prev, curr) => prev.concat(curr.facsimiles.map(f => f.id)), [])
	})

	return (
		<div>
			<Pb {...props} />
			{props.children}
		</div>
	)
}

// function Table(props: any) {
// 	return <table><tbody>{props.children}</tbody></table>
// }

export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string): Promise<DocereComponents> {
		return {
			em: styled.em``,
			note: getNote(props => props.attributes.id),
			p: styled.div`margin-bottom: 1rem`,
			transcriptie: Transcriptie,
			table: styled.div`
				border-collapse: collapse;
				display: table;
			`,
			tr: styled.div`
				display: table-row;
			`,
			td: styled.div`
				border: 1px solid #DDD;
				display: table-cell;
				padding: .5rem;
			`,
		}
	}
}

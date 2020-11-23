import React from 'react'
import { DocereComponentContainer, DocereComponentProps } from '@docere/common'
import type { DocereConfig, DocereComponents } from '@docere/common'
import styled from 'styled-components'
import { Pb, Note } from '@docere/text-components'

function Transcriptie(props: DocereComponentProps) {
	// const Pb = getPb(() => Array.from(props.layer.facsimiles))

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
			note: Note,
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

import styled from 'styled-components'
import { Paragraph } from '@docere/text-components'
// import React from 'react'
// import { PageComponentProps } from '@docere/common'
import { Person } from './bio'

export default async function pageComponents() {
	return {
		teiHeader: () => null as null,
		listBibl: styled.ul``,
		'bibl bibl': styled.span`background: red;`,
		bibl: Person,
		'listBibl > head': styled.h3``,
		'div > head': styled.h2``,
		p: Paragraph,
		text: styled.div`
			font-size: 1rem;
		`,
		// title: (props: PageComponentProps) => <Hi attributes={{ rend: "italic" }} {...props}>{props.children}</Hi>
	}
}

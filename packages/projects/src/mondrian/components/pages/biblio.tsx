import styled from 'styled-components';
import { Paragraph, Hi } from '@docere/text-components';
import React from 'react';
import { DocereComponentProps } from '@docere/common';

export default async function pageComponents() {
	return {
		teiHeader: () => null as null,
		listBibl: styled.ul``,
		'bibl bibl': styled.span`background: red;`,
		bibl: styled.li`
			margin-bottom: 1rem;
		`,
		'listBibl > head': styled.h3``,
		'div > head': styled.h2``,
		p: Paragraph,
		text: styled.div`
			font-size: 1rem;
		`,
		title: (props: DocereComponentProps) => <Hi attributes={{ rend: "italic" }} {...props}>{props.children}</Hi>
	}
}

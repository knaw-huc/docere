import React from 'react';
import styled from 'styled-components';
// import { Paragraph, Hi } from '@docere/text-components';
import { DocereComponentProps } from '@docere/common';

function BirthDeath(props: DocereComponentProps) {
	return (
		<div>
			{props.attributes.when}
			{props.children}
		</div>
	)
}

export default async function pageComponents() {
	return {
		teiHeader: () => null as null,
		listPerson: styled.ul``,
		person: styled.li.attrs((props: DocereComponentProps) => ({ id: props.attributes['xml:id'] }))`
			margin-bottom: 1rem;
			min-height: 40px;
		`,
		'persName[full="yes"]': styled.div`
			border-bottom: 1px solid #EEE;
			font-weight: bold;
		`,
		'persName[full="abb"]': () => null as null,
		'note[type="biographic"]': styled.div``,
		birth: BirthDeath,
		death: BirthDeath,
		settlement: styled.div`display: inline-block;`,
		country: styled.div`display: inline-block;`,
	}
}

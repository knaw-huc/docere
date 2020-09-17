import styled from "styled-components"
import { Colors } from '@docere/common'

export default {
	a: styled.a``,
	br: styled.span`display: block;`,
	h2: styled.h2`
		margin-top: 2em;
	`,
	h3: styled.h3`
		margin-top: 2em;
	`,
	i: styled.i``,
	li: styled.li`
		margin-bottom: 1em;
	`,
	p: styled.div`
		margin-bottom: 1em;
	`,
	table: styled.ul`
		margin-top: 2em;
	`,
	tr: styled.li`
		border-bottom: 1px solid ${Colors.BrownLight};
		display: grid;
		grid-column-gap: 32px;
		grid-template-columns: 1fr 1fr;
		margin-bottom: 1em;
		padding-bottom: 1em;
	`,
	td: styled.div``,
	text: styled.div``,
	ul: styled.ul`
		list-style: disc;
		margin-left: 1em;

		ul {
			list-style: circle;
		}
	`,
}

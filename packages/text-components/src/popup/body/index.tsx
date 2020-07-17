import styled from "styled-components"
import { DEFAULT_SPACING } from '@docere/common'

import type { EntityConfig } from '@docere/common'

export { default as EntryLinkPopupBody } from './entry-link'
export { default as PagePartPopupBody } from './page-part'
export { default as NoteLinkPopupBody } from './note-link'

export const PopupBodyWrapper = styled.div`
	display: grid;
	grid-template-rows: auto ${DEFAULT_SPACING}px;

	& > div:first-of-type {
		padding: 1rem;
	}
`

interface LinkProps {
	entityConfig: EntityConfig
}
export const PopupBodyLink = styled.button`
	background: ${(props: LinkProps) => props.entityConfig.color}11;
	border: none;
	border-top: 1px solid gray;
	color: gray;
	cursor: pointer;
	font-size: inherit;
	font-weight: normal;
	height: 100%
	margin: 0;
	outline: none;
	padding: 0;
	text-transform: inherit;

	&:hover {
		color: black;
	}

	a {
		color: inherit;
		display: block;
		line-height: ${DEFAULT_SPACING}px;
		text-decoration: none;
	}
`

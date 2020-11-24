import styled from "styled-components"

import type { Entity } from '@docere/common'

export * from './entry-link'
export * from './page-part'
export * from './note-link'

export const PopupBodyWrapper = styled.div`
	display: grid;
	grid-template-rows: auto 24px;

	& > div:first-of-type {
		padding: 1rem;
	}
`

interface LinkProps {
	entity: Entity
}
export const PopupBodyLink = styled.button`
	background: ${(props: LinkProps) => props.entity.color}22;
	border: none;
	border-top: 1px solid ${(props: LinkProps) => props.entity.color}66;
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
		color: #666;
	}

	a {
		color: inherit;
		display: block;
		line-height: 24px;
		text-decoration: none;
	}
`

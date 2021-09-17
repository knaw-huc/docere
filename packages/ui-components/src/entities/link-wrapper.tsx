import styled from "styled-components"

import type { EntityComponentProps } from './wrapper'

/**
 * An EntityWithLinkWrapper creates the normal entity body,
 * but with a 24px footer which has a link to a page, an
 * other entry, an entity, a facsimile, etc..
 * 
 * EntityWithLinkWrapper:     
 * +------------------+
 * |                  |
 * |    EntityBody    | 
 * |                  |
 * +------------------+
 * |    LinkFooter    |
 * +------------------+
 * 
 */
export const EntityWithLinkWrapper = styled.div`
	display: grid;
	grid-template-rows: auto 24px;
`

export const LinkFooter = styled.button`
	background: ${(props: EntityComponentProps) => props.entity.props.entityConfig.color}22;
	border: none;
	border-top: 1px solid ${props => props.entity.props.entityConfig.color}66;
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

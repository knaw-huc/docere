import React from 'react'
import styled from 'styled-components'
import { FOOTER_HEIGHT, FOOTER_HANDLE_HEIGHT, Colors } from '@docere/common'
import { Body } from './body'
import { Tabs } from './tabs'

const Wrapper = styled.footer`
	background: ${Colors.Grey};
	display: grid;
	grid-template-rows: ${FOOTER_HANDLE_HEIGHT}px auto;
	height: ${FOOTER_HEIGHT + FOOTER_HANDLE_HEIGHT}px;
	left: 0;
	pointer-events: none;
	position: fixed;
	right: 0;
	z-index: 6001;

	& > * {
		pointer-events: all;
	}
`

interface BProps { active: boolean }
export const Button = styled.div`
	color: ${(props: BProps) => props.active ? Colors.Orange : '#CCC'};
	cursor: pointer;
	display: inline-block;
	font-size: .8rem;
	padding: 0 .33rem;
	text-transform: capitalize;
	margin-right: .5rem;
	line-height: 1.1rem;
	border-radius: 2px;
	background: linear-gradient(#212830, #373b47);

	&:last-child {
		margin-right: 0;
	}

	&:hover {
		background: #373b47;
		color: ${(props: BProps) => props.active ? Colors.Orange : '#EEE'};
	
`

// TODO move to where this is used!
export function isEmpty(obj: Object | Array<any>) {
	if (obj == null) return true
	if (Array.isArray(obj)) return obj.length === 0
	return Object.keys(obj).length === 0
}

export function Footer() {
	return (
		<Wrapper>
			<Tabs />
			<Body />
		</Wrapper>
	)
}

import styled from 'styled-components'
import type { ComponentProps } from '@docere/common'
import { Lb } from './lb'
import { Pb } from './pb'
import getEntity from './entity'
import getNote from './note'


const has = (rendAttribute: string, rendStyle: string) => rendAttribute.split(' ').indexOf(rendStyle) > -1
const Hi = styled.span`
	${(props: ComponentProps) => {
		const { rend } = props.attributes
		if (rend == null) return ''
		const rules = []
		if (has(rend, 'underline')) rules.push('text-decoration: underline;')
		if (has(rend, 'super')) rules.push('font-style: italic;')
		if (has(rend, 'italic') || has(rend, 'i')) rules.push('font-style: italic;')
		if (has(rend, 'spaced')) rules.push('letter-spacing: .1rem;')
		return rules.join('')
	}}
`

const Paragraph = styled.div`
	margin-bottom: 2.25rem;
`

export * from './popup'

export {
	Hi,
	Lb,
	Paragraph,
	getEntity,
	getNote,
	Pb,
}

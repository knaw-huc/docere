import * as React from 'react'
import styled from 'styled-components'
import { MetadataItem } from '../index.components'
import { DEFAULT_SPACING, TOP_OFFSET, defaultMetadata } from '@docere/common'
import AppContext from '../../app/context'

interface WProps { active: boolean }
const Wrapper = styled.ul`
	box-sizing: border-box;
	height: calc(100vh - ${TOP_OFFSET}px);
	overflow-y: auto;
	padding: ${DEFAULT_SPACING}px;
	position: absolute;
	z-index: ${(p: WProps) => p.active ? 1 : -1}
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
`

interface Props extends WProps {
	metadata: Metadata
}
export default function MetadataAside(props: Props) {
	const appContext = React.useContext(AppContext)
	return (
		<Wrapper active={props.active}>
			{
				Object.keys(props.metadata)
					.map(id => {
						const data = appContext.config.metadata.find(md => md.id === id)
						const value = props.metadata[id]
						if (data == null) return { ...defaultMetadata, title: id, value }
						else return { ...defaultMetadata, ...data, value }

					})
					.filter(data => data.showInAside)
					.map((data, index) => {
						return (
							<MetadataItem key={index}>
								<span>{data.title || data.id}</span>
								<span>{Array.isArray(data.value) ? data.value.join(', ') : data.value}</span>
							</MetadataItem>
						)
					})
			}	
		</Wrapper>
	)
}

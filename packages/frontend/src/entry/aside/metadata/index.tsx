import * as React from 'react'
import styled from 'styled-components'
import { DEFAULT_SPACING, TOP_OFFSET, defaultMetadata } from '@docere/common'

import ProjectContext from '../../../app/context'
import MetadataValue from './value'
// import SearchFilterContext from '../../app/search-filter-context'

import type { AppStateAction, Metadata, MetadataConfig } from '@docere/common'

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

const MetadataItem = styled.li`
	margin-bottom: ${DEFAULT_SPACING}px;
`

const Title = styled.div`
	color: #888;
	display: block;
	font-size: .75rem;
	margin-bottom: .25rem;
	text-transform: uppercase;
`

interface Props extends WProps {
	appDispatch: React.Dispatch<AppStateAction>
	metadata: Metadata
}
function MetadataAside(props: Props) {
	const { config } = React.useContext(ProjectContext)
	const [metadataConfig, setMetadataConfig] = React.useState<MetadataConfig[]>([])

	React.useEffect(() => {
		const md: MetadataConfig[] = Object.keys(props.metadata)
			.map(id => {
				const data = config.metadata.find(md => md.id === id)
				return (data == null) ?
					{ ...defaultMetadata, title: id } :
					data
			})
			.filter(data => data.showInAside)
			.sort((data1, data2) => data1.order - data2.order)
		setMetadataConfig(md)
	}, [props.metadata])

	return (
		<Wrapper active={props.active}>
			{
				metadataConfig
					.map((data, index) => {
						return (
							<MetadataItem key={index}>
								<Title>{data.title}</Title>
								<MetadataValue
									facetId={data.id}
									value={props.metadata[data.id]}
								/>
							</MetadataItem>
						)
					})
			}	
		</Wrapper>
	)
}

export default React.memo(MetadataAside)

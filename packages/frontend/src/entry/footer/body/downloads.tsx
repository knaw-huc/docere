import * as React from 'react'
import styled from 'styled-components'
import { getEntryApiPath, Colors, useUrlObject } from '@docere/common'

import { BottomTabWrapper } from './layers'

const Ul = styled.ul`
	columns: 2;
`

const A = styled.a`
	color: ${Colors.BlueBright};
	font-size: .8rem;
	text-decoration: none;

	svg {
		height: 12px;
		margin-left: .25rem;
		width: 12px;
	}

	&:hover {
		text-decoration: underline;
	}
`

function ExternalLink(props: { children: React.ReactNode, href: string }) {
	return (
		<A target="_blank" href={props.href}>
			{props.children}
			<svg viewBox="0 0 100 100">
				<path
					d="m43,35H5v60h60V57M45,5v10l10,10-30,30 20,20 30-30 10,10h10V5z"
					fillOpacity="0"
					stroke={Colors.BlueBright}
					strokeOpacity=".5"
					strokeWidth="10"
				/>
			</svg>
		</A>
	)
}

interface Props {
	active: boolean
}
function Layers(props: Props) {
	// const { config } = React.useContext(ProjectContext)
	const { projectId, entryId } = useUrlObject()
	// const baseUrl = `/api/projects/${config.slug}/documents/${encodeURIComponent(props.entry.id)}`
	return (
		<BottomTabWrapper active={props.active}>
			<Ul>
				<li>
					<ExternalLink href={getEntryApiPath(projectId, entryId)}>
						All document data
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={getEntryApiPath(projectId, entryId, 'metadata')}>
						Metadata
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={getEntryApiPath(projectId, entryId, 'entities')}>
						Entities
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={getEntryApiPath(projectId, entryId, 'facsimiles')}>
						Facsimiles
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={getEntryApiPath(projectId, entryId, 'notes')}>
						Notes
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={getEntryApiPath(projectId, entryId, 'layers')}>
						Layers
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={getEntryApiPath(projectId, entryId, 'text')}>
						Plain text
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={`/api/projects/${projectId}/xml/${encodeURIComponent(entryId)}`}>
						Original XML
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={`/api/projects/${projectId}/xml_prepared/${encodeURIComponent(entryId)}`}>
						Prepared XML
					</ExternalLink>
				</li>
			</Ul>
		</BottomTabWrapper>
	)
}

export default React.memo(Layers)

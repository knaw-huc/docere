import * as React from 'react'
import styled from 'styled-components'
import { BottomTabWrapper } from './layers'
import ProjectContext from '../../app/context'
import { Entry, Colors } from '@docere/common'

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
	entry: Entry
}
function Layers(props: Props) {
	const { config } = React.useContext(ProjectContext)
	const baseUrl = `/api/projects/${config.slug}/documents/${encodeURIComponent(props.entry.id)}`
	return (
		<BottomTabWrapper active={props.active}>
			<Ul>
				<li>
					<ExternalLink href={baseUrl}>
						All document data
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={`${baseUrl}/metadata`}>
						Metadata
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={`${baseUrl}/entities`}>
						Entities
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={`${baseUrl}/facsimiles`}>
						Facsimiles
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={`${baseUrl}/notes`}>
						Notes
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={`${baseUrl}/layers`}>
						Layers
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={`${baseUrl}/text`}>
						Plain text
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={`${baseUrl}/original`}>
						Original XML
					</ExternalLink>
				</li>
				<li>
					<ExternalLink href={`${baseUrl}/prepared`}>
						Prepared XML
					</ExternalLink>
				</li>
			</Ul>
		</BottomTabWrapper>
	)
}

export default React.memo(Layers)

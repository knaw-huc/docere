import React from 'react'
import styled from 'styled-components'
import { fetchJson, DocereConfig, DEFAULT_SPACING, getSearchPath } from '@docere/common'
import { Link } from 'react-router-dom'

function useProjectConfigs() {
	const [projectConfigs, setProjectConfigs] = React.useState<DocereConfig[]>([])

	React.useEffect(() => {
		fetchJson(`/api/projects`)
			.then(projects => {
				Promise.all(projects.map((p: string) => fetchJson(`/api/projects/${p}/config`)))
					.then((configs: any) => {
						setProjectConfigs(
							configs
								.filter((x: any) => x != null)
								.filter((c: DocereConfig) => !c.private)
						)
					})
			})
	}, [])

	return projectConfigs
}

const Wrapper = styled.ul`
	display: grid;
    grid-template-columns: repeat(auto-fit, ${200 + DEFAULT_SPACING * 2}px);
	grid-gap: ${DEFAULT_SPACING}px;
	justify-content: center;
	padding: ${DEFAULT_SPACING}px;
`

// TODO move to config
const thumbByProjectId: Record<string, string> = {
	'encyclopaedia-britannica': 'https://view.nls.uk/iiif/1923/9934/192399340.5/square/200,/0/default.jpg',
	gheys: 'https://demo.docere.diginfra.net/iiif/gheys//NAN1%2F1.04.02%2F7565%2FNL-HaNA_1.04.02_7565_0007.jpg/200,200,2400,2400/200,200/0/default.jpg',
	utrechtpsalter: 'https://objects.library.uu.nl/fcgi-bin/iipsrv.fcgi?IIIF=/manifestation/viewer/89/31/57/89315756556586257582682156457459945203.jp2/square/200,200/0/default.jpg',
	vangogh: 'http://vangoghletters.org/vg/facsimiles/RM15_nf.png',
	gekaaptebrieven: 'https://images.huygens.knaw.nl/iiif/hca30-223/8/nl-hana_hca30-223_8_0030.tif/1500,1500,2700,2700/200,200/0/default.jpg',
	henegouwseregisters: 'https://demo.docere.diginfra.net/iiif//henegouwseregisters%2FHenegouwen%2FHE_G_bewerkt%2FHE_G_X001r_001_1.jpg/0,400,2000,2000/200,/0/default.jpg',
}

const Li = styled.li`
	border: 1px solid #DDD;
	padding: ${DEFAULT_SPACING}px;

	img {
		border: 2px solid black;
		height: 200px;
		width: 200px;
	}
`

interface ProjectProps {
	config: DocereConfig
}
function Project(props: ProjectProps) {
	return (
		<Li>
			<Link to={getSearchPath(props.config.slug)}>
				<img src={thumbByProjectId[props.config.slug]} />
				{props.config.title}
			</Link>
		</Li>
	)
}

export default function Projects() {
	const projectConfigs = useProjectConfigs()

	return (
		<Wrapper>
			{
				projectConfigs.map(projectConfig =>
					<Project
						config={projectConfig}
						key={projectConfig.slug}
					/>
				)
			}
		</Wrapper>
	)	
}

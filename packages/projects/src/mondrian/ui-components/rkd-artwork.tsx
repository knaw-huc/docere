import React from 'react'
import styled from 'styled-components'
import { DEFAULT_SPACING, ID } from '@docere/common'
import { EntityComponentProps, EntityWithLinkWrapper, LinkFooter, EntityWrapper } from '@docere/ui-components'

interface RkdImage {
	artform: string
	coverage: string
	imgUrl: string
	title: string
	created: string
	creator: string
}

function xml2json(xml: string): RkdImage {
	const parser = new DOMParser()
	const doc = parser.parseFromString(xml, 'application/xml')
	const imgUrl = doc.querySelector('*|Image').getAttribute('rdf:about')
	const title = doc.querySelector('*|Description *|title[*|lang="en"]').textContent
	const created = doc.querySelector('*|Description *|created[*|lang="en"]').textContent
	const creator = doc.querySelector('*|Description *|creator[*|lang="en"]').textContent
	const artform = doc.querySelector('*|VisualArtwork *|artform[*|lang="en"]').textContent
	const coverage = doc.querySelector('*|Description *|coverage').textContent

	return {
		artform,
		coverage,
		imgUrl,
		title,
		created,
		creator
	}
}

async function getRkdImage(id: string) {
	const url = `/api/rkdimages/${id}`
	const response = await fetch(url)
	return await response.text()
}

const cache = new Map<ID, RkdImage>()
function useRkdImage(id: string) {
	const [rkdImage, setRkdImage] = React.useState<RkdImage>(null)

	React.useEffect(() => {
		let unmounted = false

		if (cache.has(id)) {
			setRkdImage(cache.get(id))
		} else {
			getRkdImage(id).then(xml => {
				const json = xml2json(xml)
				cache.set(id, json)
				if (!unmounted) setRkdImage(json)
			})
		}

		return () => {unmounted = true}
	}, [id])

	return rkdImage
}

const Wrapper = styled.div`
	display: grid;
	grid-template-columns: ${DEFAULT_SPACING * 3}px auto;
	grid-column-gap: 1rem;
	grid-row-gap: .5rem;
	padding: 1rem;

	h2 {
		grid-column: 1 / -1;
		padding: 0;
		margin: 0;

		small {
			color: #AAA;
			font-weight: normal;
			margin-left: .5rem;
		}
	}

	img {
		max-height: ${DEFAULT_SPACING * 3}px;
		max-width: ${DEFAULT_SPACING * 3}px;
	}
`

function RkdArtworkPopupBody(props: EntityComponentProps) {
	const rkdImage = useRkdImage(props.entity.props._entityId)
	if (rkdImage == null) return null

	return (
		<EntityWrapper
			entity={props.entity}
		>
			<EntityWithLinkWrapper>
				<Wrapper>
					<h2>{rkdImage.title} <small>{rkdImage.created}</small></h2>
					<img src={rkdImage.imgUrl} />
					<div>
						<div>{rkdImage.creator}</div>
						<div>{rkdImage.coverage}</div>
					</div>
				</Wrapper>
				<LinkFooter
					entity={props.entity}
				>
					<a
						href={`https://rkd.nl/en/explore/images/${props.entity.props._entityId}`}
						onClick={ev => ev.stopPropagation()}
						target="_blank"
					>
						source: RKD.nl
					</a>
				</LinkFooter>
			</EntityWithLinkWrapper>
		</EntityWrapper>
	)
}
export const RkdArtwork = React.memo(RkdArtworkPopupBody)

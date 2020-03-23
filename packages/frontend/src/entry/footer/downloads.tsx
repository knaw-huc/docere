import * as React from 'react'
import { BottomTabWrapper } from './layers'
import AppContext from '../../app/context'
import { fetchEntryXml } from '../../utils'
import styled from 'styled-components'

function fetchAndDownloadXml(slug: string, id: string) {
	fetchEntryXml(slug, id)
		.then(doc => {
			downloadXml(new XMLSerializer().serializeToString(doc), `${slug}_${id}.xml`)
		})
}

function downloadXml(content: string, filename: string) {
	const blob = new Blob([content], { type: 'application/xml' })
	return download(blob, filename)
}

function download(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = filename
	const clickHandler = () => {
		setTimeout(() => {
			URL.revokeObjectURL(url)
			a.removeEventListener('click', clickHandler)
		}, 150)
	}
	a.addEventListener('click', clickHandler, false)
	a.click()
	return a
}

const Ul = styled.ul`
	& > li {
		margin-bottom: .5rem;
	}
`

interface Props {
	active: boolean
	entry: Entry
}
function Layers(props: Props) {
	const appContext = React.useContext(AppContext)
	return (
		<BottomTabWrapper active={props.active}>
			<Ul>
				<li
					onClick={() =>
						fetchAndDownloadXml(appContext.config.slug, props.entry.id)
					}
				>
					<button>Original XML</button>
				</li>
				<li
					onClick={() =>
						downloadXml(new XMLSerializer().serializeToString(props.entry.doc), `${props.entry.id}.xml`)
					}
				>
					<button>Prepared XML</button>
				</li>
			</Ul>
		</BottomTabWrapper>
	)
}

export default React.memo(Layers)

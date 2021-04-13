import React from 'react'
import { DEFAULT_SPACING, Facsimile, EntrySettingsContext, EntryContext, ComponentProps, ContainerContext } from '@docere/common'
import { FacsimileThumb } from '@docere/ui-components'
import styled from 'styled-components'

// TODO changed display from grid to inline, which breaks multiple 
// facsimiles in one PB. For a fix: add a container div with a grid,
// instead of directly on the wrapper. If the wrapper is not inline,
// it will not align well with the inline <pb> in the text
const Wrapper = styled.span`
	& > div {
		display: inline;
		left: ${DEFAULT_SPACING}px;
		position: absolute;
	}
`

const ThumbWrapper = styled.div`
	${(props: { multiple: boolean }) =>
		props.multiple ?
			`display: grid;` :
			''
	}
`

function useFacsimiles(ids: string) {
	const entry = React.useContext(EntryContext)
	const [facsimiles, setFacsimiles] = React.useState<Facsimile[]>([])

	React.useEffect(() => {
		if (ids == null) return

		const _facsimiles = ids.split(' ')
			.map(id => entry.textData.facsimiles.get(id))
			.filter(x => x != null)

		setFacsimiles(_facsimiles)
	}, [entry, ids])

	return facsimiles
}

export function Pb(props: ComponentProps) {
	const settings = React.useContext(EntrySettingsContext)
	const container = React.useContext(ContainerContext)
	const facsimiles = useFacsimiles(props.attributes['docere:id'])

	if (
		!settings['panels.text.showPageBeginnings'] ||
		!facsimiles.length
	) return null

	return (
		<Wrapper>
			<div>
				<ThumbWrapper multiple={facsimiles.length > 1}>
					{
						facsimiles.map(facsimile =>
							<FacsimileThumb
								facsimile={facsimile}
								key={facsimile.id}
								container={container}
							/>	
						)
					}
				</ThumbWrapper>
			</div>
		</Wrapper>
	)
}

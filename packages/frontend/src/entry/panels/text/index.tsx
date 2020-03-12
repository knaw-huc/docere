import * as React from 'react'
import DocereTextView from '@docere/text'
import styled from '@emotion/styled'
import debounce from 'lodash.debounce'
import AppContext, { useComponents } from '../../../app/context'
import Minimap from './minimap'
import { isTextLayer, getTextPanelWidth } from '../../../utils'
import { DEFAULT_SPACING, TEXT_PANEL_TEXT_WIDTH, TEXT_PANEL_GUTTER_WIDTH, DocereComponentContainer } from '@docere/common'

const TopWrapper = styled.div`
	position: relative;
`

interface WProps { layer: TextLayer }
const Wrapper = styled.div`
	box-sizing: border-box;
	height: 100%;
	overflow-y: auto;
	width: ${(props: WProps) => getTextPanelWidth(props.layer)}px;
	will-change: transform;

	& > div:first-of-type {
		grid-column: 2;
	}
`

interface TextProps {
	hasFacs: boolean
}
export const Text = styled.div`
	color: #222;
	counter-reset: linenumber notenumber;
	font-family: serif;
	font-size: 1.25rem;
	display: grid;
	grid-template-columns: ${TEXT_PANEL_TEXT_WIDTH}px auto;
	line-height: 2rem;
	padding: ${DEFAULT_SPACING}px 0 200px ${(props: TextProps) => props.hasFacs ? TEXT_PANEL_GUTTER_WIDTH : 2 * DEFAULT_SPACING}px;
	position: relative;
`

function TextPanel(props: TextPanelProps) {
	const appContext = React.useContext(AppContext)
	const textWrapperRef = React.useRef<HTMLDivElement>()
	const activeAreaRef = React.useRef<HTMLDivElement>()
	const [docereTextViewReady, setDocereTextViewReady] = React.useState(false)
	const [highlightAreas, setHighlightAreas] = React.useState<number[]>([])
	const layer = props.entry.layers.filter(isTextLayer).find(tl => tl.id === props.layer.id)
	const components = useComponents(DocereComponentContainer.Layer, layer.id)

	const handleScroll = React.useCallback(() => {
		const resetActiveArea = debounce(() => {
			activeAreaRef.current.classList.remove('active')
		}, 1000)

		const { scrollTop, scrollHeight, clientHeight } = textWrapperRef.current

		if (scrollHeight / 10 > clientHeight) {
			const maxScrollTopActiveArea = (scrollHeight/10) - clientHeight + 32
			const maxScrollTopOriginal = scrollHeight - clientHeight
			const perc = scrollTop / maxScrollTopOriginal
			activeAreaRef.current.parentElement.scrollTop = maxScrollTopActiveArea * perc
		}

		activeAreaRef.current.classList.add('active')
		activeAreaRef.current.style.transform = `translateY(${(scrollTop / 10)}px)`

		resetActiveArea()
	}, [])

	const customProps: DocereComponentProps = {
		activeFacsimileAreas: props.activeFacsimileAreas,
		activeFacsimile: props.activeFacsimile,
		activeEntity: props.activeEntity,
		activeNote: props.activeNote,
		appDispatch: props.appDispatch,
		components,
		config: appContext.config,
		entry: props.entry,
		entryDispatch: props.entryDispatch,
		insideNote: false,
		layer: props.layer
	}

	if (components == null) return null

	return (
		<TopWrapper className="text-panel">
			<Wrapper
				layer={props.layer}
				onScroll={handleScroll}
				ref={textWrapperRef}
			>
				<Text 
					hasFacs={props.entry.facsimiles?.length > 0}
				>
					<DocereTextView
						customProps={customProps}
						components={components}
						highlight={props.searchQuery}
						onLoad={setDocereTextViewReady}
						node={layer.element}
						setHighlightAreas={setHighlightAreas}
					/>
				</Text>
			</Wrapper>
			<Minimap
				activeAreaRef={activeAreaRef}
				highlightAreas={highlightAreas}
				isReady={docereTextViewReady}
				textWrapperRef={textWrapperRef}
			/>
		</TopWrapper>
	)
}

export default React.memo(TextPanel)

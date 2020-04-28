import * as React from 'react'
import DocereTextView from '@docere/text_'
import styled from 'styled-components'
import debounce from 'lodash.debounce'
import ProjectContext, { useComponents } from '../../../app/context'
import Minimap from './minimap'
import { isTextLayer } from '../../../utils'
import { DEFAULT_SPACING, TEXT_PANEL_TEXT_WIDTH, DocereComponentContainer, getTextPanelWidth, getTextPanelLeftSpacing } from '@docere/common'
import PanelHeader from '../header'
import type { DocereComponentProps, Entity, Note, DocereConfig, TextLayer } from '@docere/common'
import type { PanelsProps } from '..'
import { SearchContext } from '@docere/search_'

const TopWrapper = styled.div`
	position: relative;
`

interface WProps { activeEntity: Entity, activeNote: Note, settings: DocereConfig['entrySettings'] }
const Wrapper = styled.div`
	box-sizing: border-box;
	height: ${props => props.settings['panels.showHeaders'] ? `calc(100% - ${DEFAULT_SPACING}px)` : '100%'};
	overflow-y: auto;
	width: ${(props: WProps) => getTextPanelWidth(props.settings, props.activeNote, props.activeEntity)}px;
	will-change: transform;

	& > div:first-of-type {
		grid-column: 2;
	}
`

interface TextProps {
	settings: DocereConfig['entrySettings']
}
export const Text = styled.div`
	color: #222;
	counter-reset: linenumber notenumber;
	font-family: serif;
	font-size: 1.25rem;
	display: grid;
	grid-template-columns: ${TEXT_PANEL_TEXT_WIDTH}px auto;
	line-height: 2rem;
	padding: ${DEFAULT_SPACING}px 0 200px ${(props: TextProps) => getTextPanelLeftSpacing(props.settings)}px;
	position: relative;

	& > div {
		border-right: 1px solid #EEE;
	}
`

type TextPanelBaseProps = Pick<PanelsProps, 'activeEntity' | 'activeNote' | 'activeFacsimile' | 'activeFacsimileAreas' | 'appDispatch' | 'entryDispatch' | 'entry' | 'settings'>
interface TextPanelProps extends TextPanelBaseProps {
	layer: TextLayer
}

function TextPanel(props: TextPanelProps) {
	const { config } = React.useContext(ProjectContext)
	const searchContext = React.useContext(SearchContext)

	const textWrapperRef = React.useRef<HTMLDivElement>()
	const activeAreaRef = React.useRef<HTMLDivElement>()
	const [docereTextViewReady, setDocereTextViewReady] = React.useState(false)
	const [highlightAreas, setHighlightAreas] = React.useState<number[]>([])
	const layer = props.entry.layers.filter(isTextLayer).find(tl => tl.id === props.layer.id)
	const components = useComponents(DocereComponentContainer.Layer, layer.id)

	const handleScroll = React.useCallback(() => {
		if (!props.settings['panels.text.showMinimap']) return

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
	}, [props.settings['panels.text.showMinimap']])

	const customProps: DocereComponentProps = {
		activeFacsimileAreas: props.activeFacsimileAreas,
		activeFacsimile: props.activeFacsimile,
		activeEntity: props.activeEntity,
		activeNote: props.activeNote,
		appDispatch: props.appDispatch,
		components,
		config,
		entry: props.entry,
		entryDispatch: props.entryDispatch,
		entrySettings: props.settings,
		insideNote: false,
		layer: props.layer
	}

	if (components == null) return null

	return (
		<TopWrapper className="text-panel">
			{
				props.settings['panels.showHeaders'] &&
				<PanelHeader
					entryDispatch={props.entryDispatch}
					layer={props.layer}
				>
					{props.layer.title}
				</PanelHeader>
			}
			<Wrapper
				activeEntity={props.activeEntity}
				activeNote={props.activeNote}
				onScroll={handleScroll}
				ref={textWrapperRef}
				settings={props.settings}
			>
				<Text 
					settings={props.settings}
				>
					<DocereTextView
						customProps={customProps}
						components={components}
						highlight={searchContext.state.query}
						onLoad={setDocereTextViewReady}
						node={layer.element}
						setHighlightAreas={setHighlightAreas}
					/>
				</Text>
			</Wrapper>
			{
				props.settings['panels.text.showMinimap'] &&
				<Minimap
					activeAreaRef={activeAreaRef}
					hasHeader={props.settings['panels.showHeaders']}
					highlightAreas={highlightAreas}
					isReady={docereTextViewReady}
					textWrapperRef={textWrapperRef}
				/>
			}
		</TopWrapper>
	)
}

export default React.memo(TextPanel)

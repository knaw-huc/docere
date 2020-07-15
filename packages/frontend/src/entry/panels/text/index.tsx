import * as React from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'
import { isTextLayer, ProjectContext, useComponents, DEFAULT_SPACING, TEXT_PANEL_TEXT_WIDTH, DocereComponentContainer, getTextPanelLeftSpacing, PANEL_HEADER_HEIGHT } from '@docere/common'
import { SearchContext } from '@docere/search'
import DocereTextView from '@docere/text'

import { useNavigate } from '../../../hooks'
import PanelHeader from '../header'
import Minimap from './minimap'

import type { DocereComponentProps, DocereConfig, TextLayer } from '@docere/common'
import type { PanelsProps } from '..'

const Wrapper = styled.div`
	background: white;
	position: relative;
`

type TWProps = Pick<TextPanelProps, 'layer' | 'entrySettings'>
const TextWrapper = styled.div`
	box-sizing: border-box;
	display: grid;
	grid-template-columns: auto ${(props: TWProps) => props.layer.width}px auto;
	height: ${props => props.entrySettings['panels.showHeaders'] ? `calc(100% - ${PANEL_HEADER_HEIGHT}px)` : '100%'};
	overflow-y: auto;
	overflow-x: hidden; ${/* Hide overflow because a vertical scrollbar could add a horizontal scrollbar */''}
	position: relative;
	will-change: transform;
	z-index: 2;

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
	font-family: EB Garamond, serif;
	font-size: 1.33rem;
	font-weight: 400;
	display: grid;
	grid-template-columns: ${TEXT_PANEL_TEXT_WIDTH}px auto;
	line-height: 2.25rem;
	padding: ${DEFAULT_SPACING}px 0 200px ${(props: TextProps) => getTextPanelLeftSpacing(props.settings)}px;
	position: relative;
`

type TextPanelBaseProps = Pick<PanelsProps, 'activeEntity' | 'activeNote' | 'activeFacsimile' | 'activeFacsimileAreas' | 'appDispatch' | 'entryDispatch' | 'entry' | 'entrySettings'>
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
		if (!props.entrySettings['panels.text.showMinimap']) return

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
	}, [props.entrySettings['panels.text.showMinimap']])

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
		entrySettings: props.entrySettings,
		insideNote: false,
		layer: props.layer,
		useNavigate,
	}

	if (components == null) return null

	return (
		<Wrapper className="text-panel">
			{
				props.entrySettings['panels.showHeaders'] &&
				<PanelHeader
					entryDispatch={props.entryDispatch}
					layer={props.layer}
				>
					{props.layer.title}
				</PanelHeader>
			}
			<TextWrapper
				layer={props.layer}
				onScroll={handleScroll}
				ref={textWrapperRef}
				entrySettings={props.entrySettings}
			>
				<Text 
					settings={props.entrySettings}
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
			</TextWrapper>
			{
				props.entrySettings['panels.text.showMinimap'] &&
				<Minimap
					activeAreaRef={activeAreaRef}
					hasHeader={props.entrySettings['panels.showHeaders']}
					highlightAreas={highlightAreas}
					isReady={docereTextViewReady}
					textWrapperRef={textWrapperRef}
				/>
			}
		</Wrapper>
	)
}

export default React.memo(TextPanel)

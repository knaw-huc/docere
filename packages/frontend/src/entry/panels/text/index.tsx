import * as React from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'
import { useComponents, DEFAULT_SPACING, TEXT_PANEL_TEXT_WIDTH, ContainerType, getTextPanelLeftSpacing, PANEL_HEADER_HEIGHT, StatefulTextLayer, EntrySettingsContext, SearchContext, EntryContext, ProjectContext, CombinedKeysCache } from '@docere/common'
import { DocereTextView } from '../../../../../text/src/index'

import { useScrollEntityIntoView, useScrollFacsimileIntoView } from '../../use-scroll-into-view'
import PanelHeader from '../header'
import Minimap from './minimap'
import { ContainerProvider } from './layer-provider'

import type { DocereConfig } from '@docere/common'

const Wrapper = styled.div`
	background: white;
	position: relative;
`

type TWProps = Props & { showHeaders: boolean }
const TextWrapper = styled.div`
	box-sizing: border-box;
	display: grid;
	grid-template-columns: auto ${(props: TWProps) => props.layer.width}px auto;
	height: ${props => props.showHeaders ? `calc(100% - ${PANEL_HEADER_HEIGHT}px)` : '100%'};
	overflow-y: auto;
	overflow-x: hidden; ${/* Hide overflow because a vertical scrollbar could add a horizontal scrollbar */''}
	position: relative;
	will-change: transform;
	z-index: 2;

	& > div:first-of-type {
		grid-column: 2;
	}
`

// TODO improve name Text2
interface TextProps {
	settings: DocereConfig['entrySettings']
}
const Text2 = styled.div`
	color: #222;
	counter-reset: linenumber notenumber;
	font-family: Merriweather, serif;
	font-size: 1.1rem;
	font-weight: 400;
	display: grid;
	grid-template-columns: ${TEXT_PANEL_TEXT_WIDTH}px auto;
	line-height: 2.25rem;
	padding: ${DEFAULT_SPACING}px 0 200px ${(props: TextProps) => getTextPanelLeftSpacing(props.settings)}px;
	position: relative;
`

function Text(props: any) {
	useScrollEntityIntoView(props.theRef, ContainerType.Layer, props.layerId)
	useScrollFacsimileIntoView(props.theRef, ContainerType.Layer, props.layerId)

	return (
		<Text2
			settings={props.settings}
		>
			<div>
				{props.children}
			</div>
		</Text2>
	)
}

interface Props {
	layer: StatefulTextLayer
}

function TextPanel(props: Props) {
	const { config } = React.useContext(ProjectContext)
	const entry = React.useContext(EntryContext)
	const settings = React.useContext(EntrySettingsContext)
	const searchContext = React.useContext(SearchContext)

	const searchQueries = useSearchQueries(searchContext.state.query, entry.id, config.slug)

	const textWrapperRef = React.useRef<HTMLDivElement>()
	const activeAreaRef = React.useRef<HTMLDivElement>()

	const [docereTextViewReady, setDocereTextViewReady] = React.useState(false)
	const [highlightAreas, setHighlightAreas] = React.useState<number[]>([])

	// const layer = entry.layers.filter(isTextLayer).find(tl => tl.id === props.layer.id)
	const components = useComponents(ContainerType.Layer, props.layer.id)

	const handleScroll = React.useCallback(() => {
		if (!settings['panels.text.showMinimap']) return

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
	}, [settings['panels.text.showMinimap']])

	return (
		<ContainerProvider type={ContainerType.Layer} id={props.layer.id}>
			<Wrapper className="text-panel">
				{
					settings['panels.showHeaders'] &&
					<PanelHeader
						layer={props.layer}
					>
						{props.layer.title}
					</PanelHeader>
				}
				<TextWrapper
					data-scroll-container="true"
					layer={props.layer}
					onScroll={handleScroll}
					ref={textWrapperRef}
					showHeaders={settings['panels.showHeaders']}
				>
					<Text 
						layerId={props.layer.id}
						settings={settings}
						theRef={textWrapperRef}
					>
						<DocereTextView
							components={components}
							highlight={searchQueries}
							standoffTree={props.layer.standoffTree3}
							onLoad={setDocereTextViewReady}
							setHighlightAreas={setHighlightAreas}
						/>
					</Text>
				</TextWrapper>
				{
					settings['panels.text.showMinimap'] &&
					<Minimap
						activeAreaRef={activeAreaRef}
						hasHeader={settings['panels.showHeaders']}
						highlightAreas={highlightAreas}
						isReady={docereTextViewReady}
						textWrapperRef={textWrapperRef}
					/>
				}
			</Wrapper>
		</ContainerProvider>
	)
}

export default React.memo(TextPanel)

const queryCache = new CombinedKeysCache<string[]>()

function useSearchQueries(query: string, entryId: string, projectId: string) {
	const [searchQueries, setSearchQueries] = React.useState<string[]>([])

	React.useEffect(() => {
		if (!query.trim().length) return

		if (queryCache.has(entryId, query)) {
			setSearchQueries(queryCache.get(entryId, query))
			return
		}

		fetch(`/search/${projectId}/_search`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(
				{
					"_source": false,
					"highlight": {
						"fields": { "text": {} },
						"fragment_size": 1,
						"require_field_match": false
					},
					"query": {
						"bool": {
							"must": [
								{
									"query_string": {
										"query": query
									}
								},
								{
									"ids": {
										"values": [ entryId ]
									}
								}
							]
						}

					}

				}
			)
		})
			.then(response => response.json())
			.then(result => {
				if (result.hits.total.value > 0) {
					const searchQueries = result.hits.hits[0].highlight.text
						.map((t: string) =>
							t.replace(/<\/?em>/g, '')
						)

					queryCache.set(entryId, query, searchQueries)
					setSearchQueries(searchQueries)
				}
			})

	}, [query, entryId])

	return searchQueries
}

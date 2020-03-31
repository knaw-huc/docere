import * as React from 'react'
import styled from 'styled-components';
import MetadataAside from './metadata'
import NotesAside from './notes'
import TextDataAside from './text-data'
import Tabs from '../../ui/tabs';
import type { EntryProps } from '..';
import { ASIDE_HANDLE_WIDTH, ASIDE_WIDTH, TOP_OFFSET, AsideTab, Colors } from '@docere/common'
import type { EntryState, EntryStateAction } from '@docere/common'

const Wrapper = styled.aside`
	bottom: 0;
	display: grid;
	grid-template-columns: ${ASIDE_HANDLE_WIDTH}px auto;
	height: calc(100vh - ${TOP_OFFSET}px);
	pointer-events: none;
	position: absolute;
	top: 0;
	right: -${ASIDE_WIDTH}px;
	width: ${ASIDE_WIDTH + ASIDE_HANDLE_WIDTH}px;
	z-index: 6000;

	& > * {
		pointer-events: all;
	}
`

const Body = styled.div`
	background-color: ${Colors.Grey};
	box-sizing: border-box;
	color: #EEE;
	position: relative;
`

function isEmpty(obj: Object | Array<any>) {
	if (obj == null) return true
	if (Array.isArray(obj)) return obj.length === 0
	return Object.keys(obj).length === 0
}

type EntryAsideProps =
	Pick<EntryProps, 'appDispatch' | 'entry'> &
	Pick<EntryState, 'activeEntity' | 'activeFacsimile' | 'activeFacsimileAreas' | 'activeNote' | 'asideTab' | 'layers' | 'settings'> &
	{
		entryDispatch: React.Dispatch<EntryStateAction>
	}
function Aside(props: EntryAsideProps) {
	if (props.entry == null) return

	const hasMetadata = !isEmpty(props.entry.metadata)
	const hasEntities = !isEmpty(props.entry.entities)
	const hasNotes = !isEmpty(props.entry.notes)

	const tabs = []
	if (hasMetadata) tabs.push(AsideTab.Metadata)
	if (hasEntities) tabs.push(AsideTab.TextData)
	if (hasNotes) tabs.push(AsideTab.Notes)

	return (
		<Wrapper>
			<Tabs
				onClick={(tab: AsideTab) => props.entryDispatch({ type: 'TOGGLE_ASIDE_TAB', asideTab: tab })}
				tab={props.asideTab}
				tabs={tabs}
			/>
			<Body>
				{
					hasMetadata &&
					<MetadataAside
						active={props.asideTab === AsideTab.Metadata}
						metadata={props.entry.metadata}
					/>
				}
				{
					hasEntities &&
					<TextDataAside
						active={props.asideTab === AsideTab.TextData}
						activeEntity={props.activeEntity}
						entryDispatch={props.entryDispatch}
						layers={props.layers}
						entities={props.entry.entities}
					/>
				}
				{
					hasNotes &&
					<NotesAside
						active={props.asideTab === AsideTab.Notes}
						activeEntity={props.activeEntity}
						activeFacsimile={props.activeFacsimile}
						activeFacsimileAreas={props.activeFacsimileAreas}
						activeNote={props.activeNote}
						appDispatch={props.appDispatch}
						entry={props.entry}
						entryDispatch={props.entryDispatch}
						settings={props.settings}
					/>
				}
			</Body>
		</Wrapper>
	)
}

export default React.memo(Aside)

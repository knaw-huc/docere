import * as React from 'react'
import styled from 'styled-components';
import { ASIDE_WIDTH, AsideTab, Colors, FOOTER_HANDLE_HEIGHT } from '@docere/common'

import MetadataAside from './metadata/index'
import NotesAside from './notes'
import TextDataAside from './text-data'

import type { EntryState, EntryStateAction } from '@docere/common'
import type { EntryProps } from '..';

const Wrapper = styled.aside`
	bottom: ${FOOTER_HANDLE_HEIGHT}px;
	pointer-events: none;
	position: absolute;
	right: -${ASIDE_WIDTH}px;
	top: 0;
	width: ${ASIDE_WIDTH}px;
	z-index: 6000;

	& > * {
		pointer-events: all;
	}
`

const Body = styled.div`
	background-color: ${Colors.Grey};
	box-sizing: border-box;
	color: #EEE;
	height: 100%;
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
			{/* <Tabs
				onClick={(tab: AsideTab) => props.entryDispatch({ type: 'TOGGLE_ASIDE_TAB', asideTab: tab })}
				tab={props.asideTab}
				tabs={tabs}
			/> */}
			<Body>
				{
					hasMetadata &&
					<MetadataAside
						active={props.asideTab === AsideTab.Metadata}
						appDispatch={props.appDispatch}
						metadata={props.entry.metadata}
					/>
				}
				{
					hasEntities &&
					<TextDataAside
						active={props.asideTab === AsideTab.TextData}
						activeEntity={props.activeEntity}
						appDispatch={props.appDispatch}
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

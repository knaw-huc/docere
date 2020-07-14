import * as React from 'react'
import styled from 'styled-components';
import { ASIDE_WIDTH, AsideTab, Colors, FOOTER_HANDLE_HEIGHT } from '@docere/common'

import MetadataAside from './metadata/index'
import NotesAside from './notes'
import TextDataAside from './text-data'

import type { EntryState, EntryStateAction } from '@docere/common'
import type { EntryProps } from '..';

const Wrapper = styled.aside`
	background-color: ${Colors.Grey};
	bottom: ${FOOTER_HANDLE_HEIGHT}px;
	box-sizing: border-box;
	color: #EEE;
	height: 100%;
	position: absolute;
	right: -${ASIDE_WIDTH}px;
	top: 0;
	width: ${ASIDE_WIDTH}px;
	z-index: 6000;
`

type EntryAsideProps =
	Pick<EntryProps, 'appDispatch' | 'entry'> &
	Pick<EntryState, 'activeEntity' | 'activeFacsimile' | 'activeFacsimileAreas' | 'activeNote' | 'asideTab' | 'layers' | 'entrySettings'> &
	{
		entryDispatch: React.Dispatch<EntryStateAction>
	}
function Aside(props: EntryAsideProps) {
	if (props.entry == null) return

	return (
		<Wrapper>
			{
				props.asideTab === AsideTab.Metadata &&
				<MetadataAside
					active={props.asideTab === AsideTab.Metadata}
					appDispatch={props.appDispatch}
					metadata={props.entry.metadata}
				/>
			}
			{
				props.asideTab === AsideTab.TextData &&
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
				props.asideTab === AsideTab.Notes &&
				<NotesAside
					active={props.asideTab === AsideTab.Notes}
					activeEntity={props.activeEntity}
					activeFacsimile={props.activeFacsimile}
					activeFacsimileAreas={props.activeFacsimileAreas}
					activeNote={props.activeNote}
					appDispatch={props.appDispatch}
					entry={props.entry}
					entryDispatch={props.entryDispatch}
					entrySettings={props.entrySettings}
				/>
			}
		</Wrapper>
	)
}

export default React.memo(Aside)

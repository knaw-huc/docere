interface Entry {
	doc: XMLDocument
	facsimiles: Facsimile[]
	id: string
	metadata: Metadata
	notes: Note[]
	entities: Entity[]
	layers: Layer[]
}

interface EntryState {
	activeFacsimileAreas: FacsimileArea[]
	activeFacsimile: Facsimile
	activeEntity: Entity,
	activeNote: Note,
	asideTab: import('../enum').AsideTab
	entry: Entry
	footerTab: import('../enum').FooterTab
	layers: Layer[]
	settings: EntrySettings
}

type EntryProps = Pick<AppState, 'entry' | 'searchQuery' | 'searchTab'> & { appDispatch: React.Dispatch<AppStateAction> }

type EntryAsideProps =
	Pick<EntryProps, 'appDispatch' | 'entry'> &
	Pick<EntryState, 'activeEntity' | 'activeFacsimile' | 'activeFacsimileAreas' | 'activeNote' | 'asideTab' | 'layers' | 'settings'> &
	{
		entryDispatch: React.Dispatch<EntryStateAction>
	}
						
export enum Colors {
	Blue = '#8080ff',
	BlueLight = '#add8e6',
	BlueBright = '#0088CC',
	Brown = '#988258',
	BrownLight = '#C7AA71',
	Green = '#5fb53f',
	Grey = '#212830',
	GreyLight = '#373b47',
	Orange = '#ffa500',
	// Orange = '#C90',
	Pink = '#fd7a7a',
	Red = '#DB4437'
}

export enum DTAP {
	Inactive = 'Inactive',
	Development = 'Development',
	Testing = 'Testing',
	Acceptance = 'Acceptance',
	Production = 'Production'
}

export enum Language {
	EN = 'en',
	NL = 'nl',
}

export enum EsDataType {
	Boolean = "boolean",
	Completion = "completion",
	Date = "date",
	Geo_point = "geo_point",
	Hierarchy = "hierarchy",
	Integer = "integer",
	Keyword = "keyword",
	Null = "null",
	Text = "text",
}

export enum TextDataExtractionType {
	Attribute = "attribute",
	TextContent = "textcontent",
	Milestone = "milestone",
}

export enum LayerType {
	Facsimile = 'facsimile',
	Text = 'text',
	WitnessAnimation = 'witness-animation',
	XML = 'xml'
}

export enum EntityType {
	Artwork = 'artwork',
	Date = 'date',
	EntryLink = 'entry_link',
	Line = 'line',
	Location = 'location',
	None = 'unknown',
	Note = 'note',
	NoteLink = 'note_link',
	PagePart = 'page_part',
	Person = 'person',
}

export enum ContainerType {
	Layer = 'layer',
	Page = 'page',
	Footer = 'footer',
	Aside = 'aside',
	Search = 'search',
	CollectionNavigator = 'collection_navigator',
}

export enum UIComponentType {
	Entity = 'entity',
	SearchHome = 'search-home',
	SearchResult = 'search-result',
}

export enum AsideTab {
	Metadata = 'Metadata',
	Notes = 'Notes',
	TextData = 'Entities',
}

export enum FooterTab {
	Panels = 'panels',
	Settings = 'settings',
	Downloads = "downloads",
}

export enum SearchTab {
	Search = 'Search',
	Results = 'Results'
}

export enum TabPosition {
	Left, Right, Bottom
}

export enum Viewport {
	Entry,
	EntrySelector
}

export enum SortBy {
	Count = '_count',
	Key = '_term',
}

export enum SortDirection {
	Asc = 'asc',
	Desc = 'desc',
}

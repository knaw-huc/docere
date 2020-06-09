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

export enum RsType {
	Date = 'date',
	Location = 'location',
	None = 'unknown',
	Person = 'person'
}

export enum DocereComponentContainer {
	Layer = 'layer',
	Notes = 'notes',
	Page = 'page',
}

export enum UIComponentType {
	SearchResult = 'search-result'
}

export enum AsideTab {
	Metadata = 'Metadata',
	Notes = 'Notes',
	TextData = 'Entities',
}

export enum FooterTab {
	API = "API",
	Layers = 'Layers',
	Settings = 'Settings',
}

export enum SearchTab {
	Search = 'Search',
	Results = 'Results'
}

export enum TabPosition {
	Left, Right, Bottom
}

export enum Viewport {
	Page,
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

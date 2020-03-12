/// <reference path="./facets/index.d.ts" />

interface Hit {
	// facsimiles?: { id: string, path: string[] }[]
	id: string
	snippets: string[]
	[key: string]: any
}

interface ResultBodyProps {
	result: Hit
}

interface DocereResultBodyProps extends ResultBodyProps {
	activeId?: string
	children?: React.ReactNode
	searchTab?: import('../../enum').SearchTab
}

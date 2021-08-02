import { ROOT_NODE_NAME } from ".."

export type PartialExportOptions = Partial<Omit<ExportOptions, 'metadata'>> & {
	metadata?: Partial<ExportOptions['metadata']>
}

export interface ExportOptions {
	annotationHierarchy: string[]
	metadata: {
		addId: boolean
		addOffsets: boolean
		addRootMetadata: boolean
		exclude: string[]
		include: string[]
	}
	rootNodeName: string
}

export function extendExportOptions(options: PartialExportOptions): ExportOptions {
	return {
		annotationHierarchy: [],
		rootNodeName: ROOT_NODE_NAME,
		...options,
		metadata: {
			addId: false,
			addOffsets: false,
			addRootMetadata: false,
			exclude: [],
			include: null, // Passing an empty array means no metadata is included
			...options.metadata,
		},
	}
}

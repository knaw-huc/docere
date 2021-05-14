import { ActiveFacsimile, ID, ProjectAction, ProjectContextValue } from '@docere/common'
import OpenSeadragon from 'openseadragon'
import TiledImages from '../collection-navigator/tiled-images'

import type { Entry } from '@docere/common'
import { CollectionNavigatorBaseController } from '../collection-navigator/base-controller'

export type CollectionDocument = {
	entryIds: Set<ID>,
	facsimileId: string,
	facsimilePath: string
}

/**
 * Controller for setting the active {@link Entry}. This controller is used as part
 * of the {@link FacsimilePanel} to give the user an overview of all the facsimiles present 
 * in the current entry. When a {@link DocereConfig.collection}  is defined, the 
 * FacsimileNavigator is not shown in the facsimile panel, because the facsimiles
 * of the active entry are already visible in the CollectionNavigator.
 */
export class FacsimileNavigatorController extends CollectionNavigatorBaseController {
	constructor(
		viewer: OpenSeadragon.Viewer,
		dispatch: React.Dispatch<ProjectAction>,
		projectContext: ProjectContextValue
	) {
		super(viewer, dispatch, projectContext)
	}

	async setEntry(entry: Entry, facsimile: ActiveFacsimile) {
		const hits: CollectionDocument[] = Array.from(entry.textData.facsimiles.values())
			.map(f => ({
				entryIds: new Set([entry.id]),
				facsimileId: f.props._facsimileId,
				facsimilePath: f.props._facsimilePath
			}))
		this.tiledImages = new TiledImages(this.viewer, hits, entry, facsimile, false)
	}
}

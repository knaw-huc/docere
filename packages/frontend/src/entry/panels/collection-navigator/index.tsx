import React from 'react'
import styled from 'styled-components'
import { ProjectContext, Colors, EntryContext, FacsimileContext } from '@docere/common'

import CollectionNavigatorController from './controller'

function useOpenSeadragonController() {
	const { config, searchUrl } = React.useContext(ProjectContext)
	const { entry, setEntry } = React.useContext(EntryContext)
	const { setActiveFacsimile } = React.useContext(FacsimileContext)
	const [controller, setController] = React.useState<any>(null)

	const handleClick = (entryId: string, facsimileId: string) => {
		if (entry.id === entryId) setActiveFacsimile(facsimileId, null, null)
		else setEntry({ entryId, facsimileId })
	}

	React.useEffect(() => {
		import('openseadragon')
			.then(OpenSeadragon => {
				const viewer = OpenSeadragon.default({
					gestureSettingsMouse: {
						clickToZoom: false,
						scrollToZoom: false,
					},
					id: "osd_collection_navigator",
					prefixUrl: "/static/images/osd/",
					panVertical: false,
					preserveImageSizeOnResize: true,
					showHomeControl: false,
					showZoomControl: false,
				})

				const collectionNavigatorController = new CollectionNavigatorController(viewer, config.collection, searchUrl, handleClick)

				if (controller != null) controller.destroy()
				setController(collectionNavigatorController)
			})
	}, [])

	return controller
}

function useEntry(controller: CollectionNavigatorController) {
	const { entry } = React.useContext(EntryContext)
	const { activeFacsimile } = React.useContext(FacsimileContext)

	React.useEffect(() => {
		if (controller == null) return
		controller.setEntry(entry, activeFacsimile)
	}, [controller, entry])

	React.useEffect(() => {
		if (controller == null) return
		controller.setActiveFacsimile(activeFacsimile)
	}, [controller, activeFacsimile])
}

const Container = styled.div`
	background: ${Colors.Grey};
	grid-column: 1 / -1;
	height: 64px;
`

function CollectionNavigator() {
	const controller = useOpenSeadragonController()
	useEntry(controller)

	return (
		<Container
			id="osd_collection_navigator"
		/>
	)
}

export default React.memo(CollectionNavigator)

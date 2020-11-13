import React from 'react'
import styled from 'styled-components'
import { ProjectContext, Colors, useNavigate, useUrlObject, EntryContext } from '@docere/common'

import CollectionNavigatorController from './controller'

function useOpenSeadragonController() {
	const { config, searchUrl } = React.useContext(ProjectContext)
	const navigate = useNavigate()
	const { projectId } = useUrlObject()
	const [controller, setController] = React.useState<any>(null)

	const handleClick = React.useCallback(entryId => {
		navigate({ projectId, entryId })	
	}, [projectId])

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
	const entry = React.useContext(EntryContext)
	React.useEffect(() => {
		if (controller == null) return
		controller.setEntry(entry)
	}, [controller, entry])
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

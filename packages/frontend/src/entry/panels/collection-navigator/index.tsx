import React from 'react'
import styled from 'styled-components'
import { ProjectContext, Colors, EntryContext, FacsimileContext, DispatchContext } from '@docere/common'

import { CollectionNavigatorBaseController } from './base-controller'

function useController(Controller: typeof CollectionNavigatorBaseController, id: string) {
	const dispatch = React.useContext(DispatchContext)
	const projectContext = React.useContext(ProjectContext)
	const [controller, setController] = React.useState<any>(null)

	React.useEffect(() => {
		import('openseadragon')
			.then(OpenSeadragon => {
				const viewer = OpenSeadragon.default({
					gestureSettingsMouse: {
						clickToZoom: false,
						scrollToZoom: false,
					},
					id,
					prefixUrl: "/static/images/osd/",
					panVertical: false,
					preserveImageSizeOnResize: true,
					showHomeControl: false,
					showZoomControl: false,
				})

				const collectionNavigatorController = new Controller(viewer, dispatch, projectContext)

				if (controller != null) controller.destroy()
				setController(collectionNavigatorController)
			})
	}, [])

	return controller
}

function useEntry(controller: CollectionNavigatorBaseController) {
	const entry = React.useContext(EntryContext)
	const activeFacsimile = React.useContext(FacsimileContext)

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
	height: 64px;
`

interface Props {
	Controller: typeof CollectionNavigatorBaseController
}
function CollectionNavigator(props: Props) {
	const [containerId] = React.useState('cn' + Math.random().toString().slice(2))

	const controller = useController(props.Controller, containerId)
	useEntry(controller)

	return (
		<Container
			className="collection-navigator"
			id={containerId}
		/>
	)
}

export default React.memo(CollectionNavigator)

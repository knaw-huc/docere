import React from 'react'
import styled from 'styled-components'
import { ProjectContext, DocereConfig, Colors, useNavigate, useUrlObject, EntryContext } from '@docere/common'

import CollectionNavigatorController from './controller'

function useOpenSeadragonController(
	config: DocereConfig['collection'],
	searchUrl: ProjectContext['searchUrl'],
	handleClick: (id: string) => void
) {
	const [controller, setController] = React.useState<any>(null)

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

				const collectionNavigatorController = new CollectionNavigatorController(viewer, config, searchUrl, handleClick)

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

interface Props {
	config: ProjectContext['config']['collection']
	searchUrl: ProjectContext['searchUrl']
}
function CollectionNavigator(props: Props) {
	const navigate = useNavigate()
	const { projectId } = useUrlObject()

	const handleClick = React.useCallback(entryId => {
		navigate({ projectId, entryId })	
	}, [projectId])

	const controller = useOpenSeadragonController(
		props.config,
		props.searchUrl,
		handleClick,
	)

	useEntry(controller)

	return (
		<Container
			id="osd_collection_navigator"
		/>
	)
}

export default React.memo(CollectionNavigator)

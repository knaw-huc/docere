import React from 'react'
import styled from 'styled-components'
import { ProjectContext, Entry, DocereConfig, Colors } from '@docere/common'
import { PanelsProps } from '..'

import CollectionNavigatorController from './controller'

function useOpenSeadragonController(
	config: DocereConfig['collection'],
	searchUrl: ProjectContext['searchUrl'],
	dispatch: PanelsProps['appDispatch']
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

				const collectionNavigatorController = new CollectionNavigatorController(viewer, config, searchUrl, dispatch)

				if (controller != null) controller.destroy()
				setController(collectionNavigatorController)
			})
	}, [])

	return controller
}

function useEntry(controller: CollectionNavigatorController, entry: Entry) {
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
	appDispatch: PanelsProps['appDispatch']
	config: ProjectContext['config']['collection']
	entry: Entry
	searchUrl: ProjectContext['searchUrl']
}
function CollectionNavigator(props: Props) {
	const controller = useOpenSeadragonController(
		props.config,
		props.searchUrl,
		props.appDispatch
	)
	useEntry(controller, props.entry)

	return (
		<Container
			id="osd_collection_navigator"
		/>
	)
}

export default React.memo(CollectionNavigator)

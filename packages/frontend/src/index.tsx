import * as React from 'react'
import * as ReactDOM from 'react-dom'
import BrowserApp from './app/index'
import EntrySelector from './entry-selector'
import '@docere/common'
import configDatas from '@docere/projects'
import { analyzeWindowLocation } from './utils'
import AppContext from './app/context'

document.addEventListener('DOMContentLoaded', async function() {
	const { projectId } = analyzeWindowLocation()

	// TODO redirect to 404 if projectSlug does not exist
	const { default: configData } = await configDatas[projectId]()

	const contextValue: AppContext = {
		config: configData.config,
		getComponents: configData.getComponents(configData.config),
		getUIComponent: configData.getUIComponent(configData.config)
	}

	ReactDOM.render(
		<AppContext.Provider value={contextValue}>
			<BrowserApp
				configData={configData}
				EntrySelector={EntrySelector}
			/>
		</AppContext.Provider>
		,
		document.getElementById('container')
	)
})

// FEATS
// Add text data icon

// BUGS
// TODO order of text layers should represent config (see Van Gogh)
// TODO minimap should resize when bottom menu is toggled

// Asides
// TODO replace first letter of tab with icon + tooltip text
// TODO create media aside

// Navigation
// TODO add link to search in header and change link in h1 to ${config.slug}/home
// TODO every project has a home

// Footer menu
// TODO move portrait/landscape button and TEI download button to footer menu

// Links
// TODO link to search result
// TODO link to part of text (<pb>, <lb>, <p>, etc)
// TODO create citation

// Annotations
// TODO differentiate between machine and user annotations
// TODO add search link to annotation

// Search
// TODO when clicking facsimile in search results, activate and scroll to that facsimile in entry view

// Rest
// TODO i8n, user interface + pages
// TODO add help tooltips and turn on/off help
// TODO add facs navigator (see AF or eLaborate)
// TODO create marketing page for Docere and create link from edition to marketing page
// TODO dedup @emotion from docere, huc-faceted-search, docere-text-view
// TODO index and create facet for background pages
// TODO create a test runner for the configuration to check if the config is OK and all the XML is valid

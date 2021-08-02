import { ProjectList } from '@docere/common'
import React from 'react'
import ReactDOM from 'react-dom'

import App from './app'

declare global {
	const DocereProjects: { default: ProjectList }
}

document.addEventListener('DOMContentLoaded', function() {
	ReactDOM.render(<App />, document.getElementById('container'))
})

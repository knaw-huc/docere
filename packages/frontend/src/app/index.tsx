import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from '../home'
import Project from '../project'
import Analyze from '../analyze'
import { DocereHistoryController } from './history'

function App() {
	return (
		<Router>
			<DocereHistoryController>
				<Switch>
					<Route path={[
						"/projects/:projectId/analyze",
					]}>
						<Analyze />
					</Route>
					<Route path={[
						"/projects/:projectId/entries/:entryId*",
						"/projects/:projectId/pages/:pageId*",
						"/projects/:projectId",
					]}>
						<Project />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</DocereHistoryController>
		</Router>
	)
}

export default React.memo(App)

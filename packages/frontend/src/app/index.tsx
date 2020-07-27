import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from '../home'
import Project from '../project'
import Analyze from '../analyze'


function App() {
	return (
		<Router>
			<Switch>
				<Route path={[
					"/projects/:projectId/analyze",
				]}>
					<Analyze />
				</Route>
				<Route path={[
					"/projects/:projectId/entries/:entryId*",
					"/projects/:projectId",
				]}>
					<Project />
				</Route>
				<Route path="/">
					<Home />
				</Route>
			</Switch>
		</Router>
	)
}

export default React.memo(App)

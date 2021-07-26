import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Upload } from './upload'

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/">
					<Upload />
				</Route>
			</Switch>
		</Router>
	)
}

export default React.memo(App)

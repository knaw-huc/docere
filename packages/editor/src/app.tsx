import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import { Upload } from './upload'

const GlobalStyle = createGlobalStyle`
	body {
		overflow: hidden;
	}
`

function App() {
	return (
		<Router>
			<GlobalStyle />
			<Switch>
				<Route path="/">
					<Upload />
				</Route>
			</Switch>
		</Router>
	)
}

export default React.memo(App)

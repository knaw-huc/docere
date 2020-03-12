import * as React from 'react'
import styled from '@emotion/styled'

declare global { const Prism: any }

const Wrapper = styled.div`
	overflow-y: auto;

	& > pre {
		background: white;
		box-sizing: border-box;
		height: 100%;
		margin: 0;
		padding: 1.5em; 3em;
	}
`

interface Props {
	doc: XMLDocument
}
export default class XmlPanel extends React.PureComponent<Props> {
	componentDidMount() {
		Prism.highlightAll()
	}

	componentDidUpdate(prevProps: Props) {
		if (prevProps.doc !== this.props.doc) Prism.highlightAll()
	}

	render() {
		let root = this.props.doc.documentElement

		return (
			<Wrapper>
				<pre>
					<code className="language-xml">
						{root.outerHTML}
					</code>
				</pre>
			</Wrapper>
		)
	}
}

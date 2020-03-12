import styled from '@emotion/styled'
import { lb } from '../index'
import getPb from '../pb';

// import styled from "@emotion/styled";
// import { lb } from '../index'

// function pb(props: { activeFacsimilePath: string, facs: string, setActiveFacsimile: (a: string) => void }) {
// 	const baseUrl = `http://localhost:5004/ode/${props.facs.toLowerCase()}`
// 	const active = props.activeFacsimilePath === `${baseUrl}/info.json`
// 	return (
// 		<span
// 			onClick={() => !active ? props.setActiveFacsimile(`${baseUrl}/info.json`) : null}
// 		>
// 			<Img
// 				active={active}
// 				src={`${baseUrl}/full/,32/0/default.jpg`}
// 			/>
// 		</span>
// 	)
// }

const getComponents: GetComponents = function(_config) {
	const components: DocereComponents = {
		lb,
		pb: getPb((props) => props.facs),
		teiHeader: () => null,
		text: styled.div`padding-left: 32px`
	}
	return components
}

export default getComponents

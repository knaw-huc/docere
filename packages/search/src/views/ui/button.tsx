import styled from 'styled-components'

interface ButtonProps {
	active?: boolean
	spotColor: string
}
export const Button = styled('button')`
	background: ${(props: ButtonProps) => props.active ? props.spotColor : 'none'};
	border-radius: .2rem;
	border: 1px solid ${props => `${props.spotColor}44`};
	color: ${props => props.active ? 'white' : props.spotColor};
	cursor: pointer;
	font-size: 0.8rem;
	outline: none;
	padding: 0.1rem 0.3rem;

	&:hover {
		background-color: ${props => props.active ? props.spotColor : `${props.spotColor}11`};
		border-color: ${props => props.spotColor};
	}
`

export const RoundButton = styled(Button)`
	border-radius: .6rem;
	height: 1.2rem;
	line-height: 1rem;
	padding: 0;
	text-align: center;
	width: 1.2rem;
`


export const MoreLessButton = styled(Button)`
	display: inline-block;
	font-size: .8rem;
	font-weight: normal;
`

export const FacetMenuButton = styled(Button)`
	align-content: center;
	border-radius: 3px;
	border: 1px solid white;
	display: grid;
	height: 20px;
	justify-content: center;
	transform: translateY(0);
	width: 20px;

	${(props: { active: boolean, spotColor: string }) => props.active ?
		`
			border: 1px solid ${props.spotColor};
		` :
		`&:hover {
			border: 1px solid ${props.spotColor}66;
		}`
	}

`

export const FacetInfoButton = styled(FacetMenuButton)`
`

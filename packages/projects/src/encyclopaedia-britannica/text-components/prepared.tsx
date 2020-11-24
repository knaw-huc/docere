import * as React from 'react'
import styled from 'styled-components'
import type { ComponentProps, DocereComponents } from '@docere/common'

// function useActive(props: DocereComponentProps): [boolean, (ev: any) => void] {
// 	const [active, setActive] = React.useState<boolean>(false)

// 	React.useEffect(() => {
// 		// console.log(props.activeEntity, props.attributes.id)
// 		setActive(props.attributes.id === props.activeEntity?.id)
// 	}, [props.activeEntity])

// 	const handleClick = React.useCallback(ev => {
// 		ev.stopPropagation()
// 		props.entryDispatch({
// 			type: 'SET_ENTITY',
// 			id: props.attributes.id,
// 		})
// 	}, [props.attributes.id, active])

// 	return [active, handleClick]
// }

const ArticleWrapper = styled.div`
	cursor: pointer;
	margin-bottom: 1.5rem;

	${(props: { active: boolean }) =>
		props.active ?
			`max-height: auto;
			overflow: auto;
			color: #666;
			` :
			`max-height: 2rem;
			overflow: hidden;
			color: white;
			`
	}
`

// TODO fix useActive
function Article(props: ComponentProps) {
	// const [active, handleClick] = useActive(props)

	return (
		<ArticleWrapper
			active={false}
			// onClick={handleClick}
		>
			{props.children}
		</ArticleWrapper>
	)
}

const components: DocereComponents = {
	article: Article,
	lemma: styled.span`font-weight: bold; color: #222;`,
}
export default components

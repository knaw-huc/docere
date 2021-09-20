import { UIComponentType } from '@docere/common'
import { EntityComponentProps, EntityWrapper, TextEntity } from '@docere/ui-components'
import { SearchResult } from './search-result'
import { AttendantEntity } from './attendant'
import React from 'react'
import styled from 'styled-components'

const components = new Map()
const entities = new Map()

components.set(UIComponentType.Entity, entities)
components.set(UIComponentType.SearchResult, SearchResult)
components.set(UIComponentType.SearchHome, SearchHome)

entities.set('line', TextEntity)
entities.set('resolution', EmptyEntity)
entities.set('attendance_list', EmptyEntity)
entities.set('attendant', AttendantEntity)

export default components


function EmptyEntity(props: EntityComponentProps) {
	return (
		<EntityWrapper
			entity={props.entity}
		/>
	)
}

function SearchHome() {
	return (
		<Wrapper>
			<h2 style={{margin: 0, fontSize: '2rem'}}>Webeditie Resoluties Staten-Generaal</h2>
			<h3 style={{margin: 0}}>prototype achttiende eeuw</h3>
			<section>
				<div>Lees meer over:</div>
				<ul>
					<li>
						<a href="https://republic.huygens.knaw.nl/index.php/zoeken-naar-tekst-in-republic/#Zoektermen">Zoektermen</a>
					</li>
					<li>
						<a href="https://republic.huygens.knaw.nl/index.php/zoeken-naar-tekst-in-republic/#Zoekoperatoren">Zoekoperatoren</a>
					</li>
					<li>
						<a href="https://republic.huygens.knaw.nl/index.php/zoeken-naar-tekst-in-republic/#zoekoperatorenCombi">Het combineren van zoekoperatoren</a>
					</li>
					<li>
						<a href="https://republic.huygens.knaw.nl/index.php/zoeken-naar-tekst-in-republic/#Hoofdletters-leestekens">Hoofdletters en leestekens</a>
					</li>
				</ul>
			</section>
			<section className="feedback">
				Deze tool is in ontwikkeling. Feedback kunt u sturen naar <a href="mailto:Republic_Goetgevonden@huygens.knaw.nl">Republic_Goetgevonden@huygens.knaw.nl</a>
			</section>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	font-family: Roboto, sans-serif;

	section {
		margin: 2rem 0;
	}

	a {
		color: #0088CC;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	.feedback {
		background: #0088CC11;
		padding: 1rem;
		border-radius: 4px;
	}
`

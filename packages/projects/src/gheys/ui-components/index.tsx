import { UIComponentType } from '@docere/common'
import { SearchResult } from './search-result'

const components = new Map()

const searchResults = new Map()
searchResults.set('_default', SearchResult)

components.set(UIComponentType.SearchResult, searchResults)

export default components

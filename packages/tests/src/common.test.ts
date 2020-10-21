import { getQueryString, getPath } from "@docere/common"

describe('Common', () => {
	describe('URL', () => {
		describe('Get paths', () => {
			it('Should handle getPath', () => {
				expect(() => getPath(null)).toThrow('[getPath] Project ID cannot be null')
				expect(() => getPath({ projectId: null })).toThrow('[getPath] Project ID cannot be null')
				expect(getPath({ projectId: 'p' })).toBe('/projects/p')
				expect(getPath({ projectId: 'p', entryId: 'e' })).toBe('/projects/p/entries/e')
				expect(getPath({ projectId: 'p', pageId: 'a' })).toBe('/projects/p/pages/a')
				expect(getPath({ projectId: 'p', entryId: 'e', query: null })).toBe('/projects/p/entries/e')
				expect(getPath({ projectId: 'p', entryId: 'e', query: {} })).toBe('/projects/p/entries/e')
				expect(getPath({ projectId: 'p', entryId: 'e', query: { facsimileId: ['f'] } })).toBe('/projects/p/entries/e?fi=f')
				expect(getPath({ projectId: 'p', entryId: 'e', query: { facsimileId: ['f'], lineId: ['l'] } })).toBe('/projects/p/entries/e?fi=f&li=l')
			})

			it('Should handle getQueryString', () => {
				expect(getQueryString(null)).toBe('')
				expect(getQueryString({})).toBe('')
				expect(getQueryString({ entityId: ['12'] })).toBe('?ei=12')
				expect(getQueryString({ entityId: ['12', '13'] })).toBe('?ei=12&ei=13')
				expect(getQueryString({ entityId: ['12', '13', '14'] })).toBe('?ei=12&ei=13&ei=14')
				expect(getQueryString({ entityId: ['12', '13'], facsimileId: ['14'] })).toBe('?ei=12&ei=13&fi=14')
				expect(getQueryString({ entityId: ['13'], facsimileId: ['14'], blockId: ['15'] })).toBe('?ei=13&fi=14&bi=15')
				expect(getQueryString({ entityId: ['13'], facsimileId: ['14'], blockId: ['15'], lineId: ['16'] })).toBe('?ei=13&fi=14&bi=15&li=16')
			})
		})
	})
})

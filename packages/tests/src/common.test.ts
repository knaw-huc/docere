import { indexOfIterator, getQueryString, getProjectPath, getRectoVersoSequence, getPagePath, getEntryPath, DocereConfig, extendConfig } from "../../common/src"

describe('Common', () => {
	describe('Config', () => {
		describe('Defaults', () => {
			let config: DocereConfig

			beforeAll(() => {
				config = extendConfig({ slug: 'test' })
			})

			it('Should have sane defaults', () => {
				expect(config.collection).toBeNull()
				expect(config.documents.remoteDirectories[0]).toBe('test')
				expect(config.documents.stripRemoteDirectoryFromDocumentId).toBeTruthy()
				expect(config.entities2).toHaveLength(0)
				expect(config.layers2).toHaveLength(0)
				expect(config.metadata2).toHaveLength(0)
				expect(config.pages).toBeNull()
				expect(config.parts).toBeNull()
				expect(config.private).toBeFalsy()
				expect(config.searchResultCount).toBe(20)
				expect(config.slug).toBe('test')
				expect(config.title).toBe('Test')
			})
		})
	})

	describe('URL', () => {
		describe('Get paths', () => {
			it('Should handle getPath', () => {
				expect(getProjectPath('p')).toBe('/projects/p')
				expect(getEntryPath('p', 'e' )).toBe('/projects/p/entries/e')
				expect(getPagePath('p', 'a' )).toBe('/projects/p/pages/a')
				expect(getEntryPath('p', 'e', null)).toBe('/projects/p/entries/e')
				expect(getEntryPath('p', 'e',{})).toBe('/projects/p/entries/e')
				expect(getEntryPath('p', 'e',{ facsimileId: new Set(['f']) })).toBe('/projects/p/entries/e?fi=f')
				expect(getEntryPath('p', 'e',{ facsimileId: new Set(['f']), lineId: new Set(['l']) })).toBe('/projects/p/entries/e?fi=f&li=l')
			})

			it('Should handle getQueryString', () => {
				expect(getQueryString(null)).toBe('')
				expect(getQueryString({})).toBe('')
				expect(getQueryString({ entityId: new Set(['12']) })).toBe('?ei=12')
				expect(getQueryString({ entityId: new Set(['12', '13']) })).toBe('?ei=12&ei=13')
				expect(getQueryString({ entityId: new Set(['12', '13', '14']) })).toBe('?ei=12&ei=13&ei=14')
				expect(getQueryString({ entityId: new Set(['12', '13']), facsimileId: new Set(['14']) })).toBe('?ei=12&ei=13&fi=14')
				expect(getQueryString({ entityId: new Set(['13']), facsimileId: new Set(['14']), blockId: new Set(['15']) })).toBe('?ei=13&fi=14&bi=15')
				expect(getQueryString({ entityId: new Set(['13']), facsimileId: new Set(['14']), blockId: new Set(['15']), lineId: new Set(['16']) })).toBe('?ei=13&fi=14&bi=15&li=16')
			})
		})
	})

	describe('Utils', () => {
		it('[indexOfIterator] Should get the index of an iterable (Set or keys of Map)', () => {
			const set = new Set([1, 2, 3, 4])
			expect(indexOfIterator(set, 1)).toBe(0)
			expect(indexOfIterator(set, 2)).toBe(1)
			expect(indexOfIterator(set, 3)).toBe(2)
			expect(indexOfIterator(set, 4)).toBe(3)
			expect(indexOfIterator(set, 0)).toBe(null)
			expect(indexOfIterator(set, 5)).toBe(null)
			expect(indexOfIterator(set, null)).toBe(null)

			const map = new Map([['a1', 1], ['a2', 2], ['a3', 3], ['a4', 4]])
			expect(indexOfIterator(map, 'a1')).toBe(0)
			expect(indexOfIterator(map, 'a2')).toBe(1)
			expect(indexOfIterator(map, 'a3')).toBe(2)
			expect(indexOfIterator(map, 'a4')).toBe(3)
			expect(indexOfIterator(map, 'a0')).toBe(null)
			expect(indexOfIterator(map, 'a5')).toBe(null)
			expect(indexOfIterator(map, null)).toBe(null)
		})

		it('[getRectoVersoSequence]', () => {
			expect(getRectoVersoSequence('2v-1r')).toHaveLength(0)
			expect(getRectoVersoSequence('1v-1r')).toHaveLength(0)
			expect(getRectoVersoSequence(null)).toHaveLength(0)
			expect(getRectoVersoSequence('1r')).toEqual(['1r'])
			expect(getRectoVersoSequence('1r-1v')).toEqual(['1r', '1v'])
			expect(getRectoVersoSequence('1r-v')).toEqual(['1r', '1v'])
			expect(getRectoVersoSequence('1r-2r')).toEqual(['1r', '1v', '2r'])
			expect(getRectoVersoSequence('1v-2r')).toEqual(['1v', '2r'])
			expect(getRectoVersoSequence('1v-4r')).toEqual(['1v', '2r', '2v', '3r', '3v', '4r'])
			expect(getRectoVersoSequence('1r-4v')).toEqual(['1r', '1v', '2r', '2v', '3r', '3v', '4r', '4v'])
		})
	})
})

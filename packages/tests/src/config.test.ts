import { extendConfigData, DocereConfig } from '../../common/src'

describe('Config', () => {
	describe('Defaults', () => {
		let config: DocereConfig

		beforeAll(() => {
			config = extendConfigData({ slug: 'test' })
		})

		it('Should have sane defaults', () => {
			expect(config.collection).toBeNull()
			expect(config.documents.remoteDirectories[0]).toBe('test')
			expect(config.documents.stripRemoteDirectoryFromDocumentId).toBeTruthy()
			expect(config.entities).toHaveLength(0)
			expect(config.layers).toHaveLength(0)
			expect(config.metadata).toHaveLength(0)
			expect(config.pages).toBeNull()
			expect(config.parts).toBeNull()
			expect(config.private).toBeFalsy()
			expect(config.searchResultCount).toBe(20)
			expect(config.slug).toBe('test')
			expect(config.title).toBe('Test')
		})
	})

	describe('Entities', () => {
		let config: DocereConfig

		beforeAll(() => {
			config = extendConfigData({
				slug: 'test',
				entities: []
			})
		})

		it('Should have 2 entities', () => {
			expect(config.entities).toHaveLength(0)
		})
	})
})

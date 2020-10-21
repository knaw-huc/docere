import { extendConfigData, DocereConfig } from '../../common/src'

describe('Config', () => {
	let config: DocereConfig

	beforeAll(() => {
		config = extendConfigData({ slug: 'test' })
	})

	it('Should not be private', () => {
		expect(config.private).toBeFalsy()
	})

	it('Should create title', () => {
		expect(config.title).toBe('Test')
	})

	it('Should have a searchResultCount of 20', () => {
		expect(config.searchResultCount).toBe(20)
	})

	it('Should start with empty arrays', () => {
		expect(config.entities).toHaveLength(0)
		expect(config.layers).toHaveLength(0)
		expect(config.metadata).toHaveLength(0)
		expect(config.pages).toHaveLength(0)
	})

	describe('Parts', () => {
		it('Should not be defined', () => {
			expect(config.parts).toBeNull()
		})
	})
})

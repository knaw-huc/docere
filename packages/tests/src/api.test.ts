import { extendConfig } from '../../common'
import { fetchSource } from '../../api/src/db/handle-source/fetch-source'

const globalRef: any = global

describe('API', () => {
	describe('Handle source', () => {
		describe('fetchSource', () => {
			const response = {
				text: () => '<doc>This<a /> is <b /> a <c /> doc</doc>',
				json: () => ({ chars: 'This is a document', meta: { 1: '2' }, notes: [] as any[] })
			}
			globalRef.fetch = jest.fn(() => Promise.resolve(response))

			it('Should fetch XML', async () => {
				const source = await fetchSource('/some-path', extendConfig({ documents: { type: 'xml' }, slug: 'test' }))
				expect(globalRef.fetch).toHaveBeenCalled()
				expect(source.annotations).toHaveLength(4)
				expect(source.text).toHaveLength(15)
				expect(Object.keys(source.metadata)).toHaveLength(0)
			})

			it('Should throw when fetch JSON without a config.standoff.prepareSource function', async () => {
				const func = fetchSource(
					'/some-path',
					extendConfig({ documents: { type: 'json' }, slug: 'test' })
				)

				await expect(func).rejects
					.toEqual(Error("[xml2standoff] prepareSource can't be empty when the source is of type JSON"))
			})

			it('Should fetch JSON', async () => {
				const source = await fetchSource(
					'/some-path',
					extendConfig({
						documents: { type: 'json' },
						slug: 'test',
						standoff: {
							prepareSource: source => ({
								annotations: source.notes,
								metadata: source.meta,
								text: source.chars,
							}) 
						}
					})
				)

				expect(source.annotations).toHaveLength(0)
				expect(source.text).toHaveLength(18)
				expect(Object.keys(source.metadata)).toHaveLength(1)
			})
		})
	})
})

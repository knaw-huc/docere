import { extendConfig } from '@docere/common'
import { getSourceIdFromRemoteFilePath } from '../../../api/src/db/handle-source/get-source-id-from-file-path'

describe('API', () => {
	describe('extractDocumentIdFromRemoteFilePath', () => {
		const func = getSourceIdFromRemoteFilePath
		const config = extendConfig({ slug: 'mondrian', documents: { remotePath: 'brieven' } })

		it('Should extract entryId from remote server XML path', () => {
			expect(func('/mondrian', config)).toBeNull()

			expect(func('/mondrian/', config)).toBeNull()

			expect(func('/mondrian/some-sub-dir', config)).toBeNull()

			expect(func('/mondrian/some-id.xml', config))
				.toBe('some-id')

			expect(func('/mondrian/some-sub-dir/some-id.html', config))
				.toBe('some-sub-dir/some-id')

			expect(func('/mondrian/brieven/some-id.xml', config))
				.toBe('some-id')

			expect(func('/mondrian/brieven/extra-dir/some-id.xml', config))
				.toBe('extra-dir/some-id')
		})
	})
})

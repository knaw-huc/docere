import { getDocumentIdFromRemoteXmlFilePath } from "../../api/src/utils"

describe('API', () => {
	describe('extractDocumentIdFromRemoteFilePath', () => {
		const func = getDocumentIdFromRemoteXmlFilePath

		it('Should extract entryId from remote server XML path', () => {
			const noDocumentId = func('/mondrian', 'mondrian', true)
			expect(noDocumentId).toBeNull()

			const noDocumentId1 = func('/mondrian/', 'mondrian', true)
			expect(noDocumentId1).toBeNull()

			const noDocumentId2 = func('/mondrian/some-sub-dir', 'mondrian', true)
			expect(noDocumentId2).toBeNull()

			const noDocumentId3 = func('/mondrian/some-sub-dir/some-id.html', 'mondrian', true)
			expect(noDocumentId3).toBeNull()

			const documentId0 = func('/mondrian/some-id.xml', 'mondrian', true)
			expect(documentId0).toBe('some-id')

			const documentId1 = func('/mondrian/brieven/some-id.xml', 'mondrian', true)
			expect(documentId1).toBe('brieven/some-id')

			const documentId5 = func('/mondrian/brieven/some-id.xml', '/mondrian', true)
			expect(documentId5).toBe('brieven/some-id')

			const documentId2 = func('/mondrian/brieven/extra-dir/some-id.xml', 'mondrian', true)
			expect(documentId2).toBe('brieven/extra-dir/some-id')

			const documentId3 = func('/mondrian/brieven/extra-dir/some-id.xml', 'mondrian/brieven/extra-dir', true)
			expect(documentId3).toBe('some-id')

			const documentId4 = func('/mondrian/brieven/extra-dir/some-id.xml', 'mondrian/brieven/extra-dir', false)
			expect(documentId4).toBe('mondrian/brieven/extra-dir/some-id')
		})
	})
})

import { getDocumentIdFromRemoteXmlFilePath } from "../../api/src/utils"

describe('API', () => {
	describe('extractDocumentIdFromRemoteFilePath', () => {
		const func = getDocumentIdFromRemoteXmlFilePath

		it('Should extract entryId from remote server XML path', () => {
			const noDocumentId = func('/mondrian', 'mondrian')
			expect(noDocumentId).toBeNull()

			const noDocumentId1 = func('/mondrian/', 'mondrian')
			expect(noDocumentId1).toBeNull()

			const noDocumentId2 = func('/mondrian/some-sub-dir', 'mondrian')
			expect(noDocumentId2).toBeNull()

			const noDocumentId3 = func('/mondrian/some-sub-dir/some-id.html', 'mondrian')
			expect(noDocumentId3).toBeNull()

			const documentId0 = func('/mondrian/some-id.xml', 'mondrian')
			expect(documentId0).toBe('some-id')

			const documentId1 = func('/mondrian/brieven/some-id.xml', 'mondrian')
			expect(documentId1).toBe('brieven/some-id')

			const documentId2 = func('/mondrian/brieven/extra-dir/some-id.xml', 'mondrian')
			expect(documentId2).toBe('brieven/extra-dir/some-id')
		})
	})
})

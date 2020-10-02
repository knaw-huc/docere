import { extractDocumentIdFromRemoteFilePath } from "../../api/src/utils"

describe('API', () => {
	describe('extractDocumentIdFromRemoteFilePath', () => {
		it('Should extract entryId from remote server XML path', () => {
			const documentId0 = extractDocumentIdFromRemoteFilePath('/mondrian/some-id.xml', 'mondrian')
			expect(documentId0).toBe('some-id')

			const documentId1 = extractDocumentIdFromRemoteFilePath('/mondrian/brieven/some-id.xml', 'mondrian')
			expect(documentId1).toBe('brieven/some-id')

			const documentId2 = extractDocumentIdFromRemoteFilePath('/mondrian/brieven/extra-dir/some-id.xml', 'mondrian')
			expect(documentId2).toBe('brieven/extra-dir/some-id')
		})
	})
})

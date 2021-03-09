export const BASE_PATH = '/api'
export const PROJECT_BASE_PATH = `${BASE_PATH}/projects/:projectId`
export const DOCUMENT_BASE_PATH = `${PROJECT_BASE_PATH}/documents/:documentId`

export const XML_SERVER_ENDPOINT = `${process.env.DOCERE_XML_URL}/xml`

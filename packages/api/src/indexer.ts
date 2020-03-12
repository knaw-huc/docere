import * as es from '@elastic/elasticsearch'
import Puppenv from './puppenv'
import { listProjects, getXmlFiles, readFileContents, getEntryIdFromFilePath, getElasticSearchDocument, isError, logError } from './utils'

const puppenv = new Puppenv()
const esClient = new es.Client({ node: 'http://localhost:9200' })

async function handleProject(projectId: string) {
	const filePaths = await getXmlFiles(projectId, 20)

	// Get the ElasticSearch mapping for the project
	const mapping = await puppenv.getMapping(projectId, filePaths)
	if (isError(mapping)) {
		logError('Failed to get mapping', null, mapping.__error)
		return
	}

	// Delete the previous index
	try {
		await esClient.indices.delete({ index: projectId })	
	} catch (err) {
		// console.log('deleteIndex', err)	
	}

	// Create a fresh index
	try {
		await esClient.indices.create({
			index: projectId,
			body: mapping
		})	
	} catch (err) {
		console.log('createIndex', err)
	}

	// Insert every XML file one by one
	let index = 0
	for (const filePath of filePaths) {
		const xml = readFileContents(filePath)
		const entryId = getEntryIdFromFilePath(filePath, projectId)
		const x = await puppenv.prepareAndExtract(xml, projectId, entryId)
		const esDocument = getElasticSearchDocument(x)
		if (isError(esDocument)) return esDocument.__error

		try {
			await esClient.index({
				index: projectId,
				body: esDocument,
			})
			process.stdout.write(`Indexed '${entryId}' from project '${projectId}'\t\t(${++index} of ${filePaths.length})\n`)
		} catch (err) {
			console.log(err)	
		}
	}
}

async function main() {
	await puppenv.start()

	// List the project dirs => ['vangogh', 'kranten1700', 'gheys']
	const projectDirs = listProjects()
	
	// Read input from the CLI
	const project = process.argv.slice(2, 3)[0]

	// If a projects was entered in the CLI, check if it exists, if not exit
	if (project != null && project.length && projectDirs.indexOf(project) === -1) {
		logError('Project not found: ', project)
		await puppenv.close()
		esClient.close()
		return
	}

	// If project is empty (nothing entered in the CLI), default to all projects
	const projects = project == null ? projectDirs : [project]

	// Process every project
	for (const projectSlug of projects) {
		await handleProject(projectSlug)
	}

	// Clean up
	await puppenv.close()
	esClient.close()
	console.log('')
}

main()

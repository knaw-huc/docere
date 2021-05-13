import { ProjectList } from '@docere/common'
import { dtapMap } from './dtap'

const projectList: ProjectList = {
	// bosscheschepenprotocollen: {
	// 	config: async function() { return await import('./bosscheschepenprotocollen/config') },
	// 	getTextComponents: async function() { return await import('./bosscheschepenprotocollen/text-components') },
	// },
	// // ecodicesnl: {
	// // 	config: async function() { return await import('./ecodicesnl/config') },
	// // 	getTextComponents: async function() { return { default: () => async () => ({}) } },
	// // },
	// florariumtemporum: {
	// 	config: async function() { return await import('./florariumtemporum/config') },
	// 	getTextComponents: async function() { return await import('./suriano/text-components') }
	// },
	// gheys: {
	// 	config: async function() { return await import('./gheys/config') },
	// 	getTextComponents: async function() { return await import('./gheys/text-components') },
	// 	getUIComponents: async function() { return await import('./gheys/ui-components') },
	// },
	// gekaaptebrieven: {
	// 	config: async function() { return await import('./gekaaptebrieven/config') },
	// 	getTextComponents: async function() { return await import('./gekaaptebrieven/text-components') },
	// 	getUIComponents: async function() { return await import('./gekaaptebrieven/ui-components') }
	// },
	// henegouwseregisters: {
	// 	config: async function() { return await import('./henegouwseregisters/config') },
	// 	getTextComponents: async function() { return await import('./plakaatboek-guyana-1670-1816/text-components') }
	// },
	// isidore: {
	// 	config: async function() { return await import('./isidore/config') },
	// 	getTextComponents: async function() { return await import('./isidore/text-components') },
	// },
	// kranten1700: {
	// 	config: async function() { return await import('./kranten1700/config') },
	// 	getTextComponents: async function() { return await import('./kranten1700/text-components') },
	// },
	// mondrian: {
	// 	config: async function() { return await import('./mondrian/config') },
	// 	getTextComponents: async function() { return await import('./mondrian/text-components') },
	// 	getUIComponents: async function() { return await import('./mondrian/ui-components') },
	// },
	// 'plakaatboek-guyana-1670-1816': {
	// 	config: async function() { return await import('./plakaatboek-guyana-1670-1816/config') },
	// 	getTextComponents: async function() { return await import('./plakaatboek-guyana-1670-1816/text-components') }
	// },
	republic: {
		config: async function() { return await import('./republic/config') },
		getTextComponents: async function() { return await import('./republic/text-components') },
		getUIComponents: async function() { return await import('./republic/ui-components') },
	},
	suriano: {
		config: async function() { return await import('./suriano/config') },
		getTextComponents: async function() { return await import('./suriano/text-components') },
		getUIComponents: async function() { return await import('./suriano/ui-components') },
	},
	// utrechtpsalter: {
	// 	config: async function() { return await import('./utrechtpsalter/config') },
	// 	getTextComponents: async function() { return await import('./utrechtpsalter/text-components') },
	// },
	// vangogh: {
	// 	config: async function() { return await import('./vangogh/config') },
	// 	getTextComponents: async function() { return await import('./vangogh/text-components') },
	// 	getUIComponents: async function() { return await import('./vangogh/ui-components') },
	// },
}

declare global {
	const DOCERE_DTAP: string
}

let currentProjects: ProjectList = {}

for (const projectId of Object.keys(projectList)) {
	if (dtapMap[projectId] == null) console.error(`Project "${projectId}" has no DTAP`)
	if (dtapMap[projectId] >= DOCERE_DTAP) {
		currentProjects[projectId] = projectList[projectId]
	}
}

export default currentProjects


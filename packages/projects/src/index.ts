// import type { DocereConfigData, GetUIComponent, GetComponents, DocereConfig } from '@docere/common'
import type { ProjectList } from '@docere/common'

const projectList: ProjectList = {
	achterdeschermen: {
		config: async function() { return await import('./achterdeschermen/config') },
		getTextComponents: async function() { return await import('./achterdeschermen/text-components') },
	},
	'encyclopaedia-britannica': {
		config: async function() { return await import('./encyclopaedia-britannica/config') },
		getTextComponents: async function() { return await import('./encyclopaedia-britannica/text-components') },
	},
	gheys: {
		config: async function() { return await import('./gheys/config') },
		getTextComponents: async function() { return await import('./gheys/text-components') },
		getUIComponent: async function() { return await import('./gheys/ui-components') },
	},
	gekaaptebrieven: {
		config: async function() { return await import('./gekaaptebrieven/config') },
		getTextComponents: async function() { return await import('./gekaaptebrieven/text-components') },
	},
	henegouwseregisters: {
		config: async function() { return await import('./henegouwseregisters/config') },
		getTextComponents: async function() { return await import('./plakaatboek-guyana-1670-1816/text-components') }
	},
	isidore: {
		config: async function() { return await import('./isidore/config') },
		getTextComponents: async function() { return await import('./isidore/text-components') },
	},
	kranten1700: {
		config: async function() { return await import('./kranten1700/config') },
		getTextComponents: async function() { return await import('./kranten1700/text-components') },
	},
	mondrian: {
		config: async function() { return await import('./mondrian/config') },
		getTextComponents: async function() { return await import('./mondrian/text-components') },
	},
	'plakaatboek-guyana-1670-1816': {
		config: async function() { return await import('./plakaatboek-guyana-1670-1816/config') },
		getTextComponents: async function() { return await import('./plakaatboek-guyana-1670-1816/text-components') }
	},
	republic: {
		config: async function() { return await import('./republic/config') },
		getTextComponents: async function() { return await import('./republic/text-components') }
	},
	suriano: {
		config: async function() { return await import('./suriano/config') },
		getTextComponents: async function() { return await import('./suriano/text-components') }
	},
	utrechtpsalter: {
		config: async function() { return await import('./utrechtpsalter/config') },
		getTextComponents: async function() { return await import('./utrechtpsalter/text-components') }
	},
	vangogh: {
		config: async function() { return await import('./vangogh/config') },
		getTextComponents: async function() { return await import('./vangogh/text-components') },
		getUIComponent: async function() { return await import('./vangogh/ui-components') },
	},
}

export default projectList

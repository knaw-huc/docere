import type { DocereConfigData } from '@docere/common'

export default  {
	achterdeschermen: async function() { return await import('./achterdeschermen') },
	'encyclopaedia-britannica': async function() { return await import('./encyclopaedia-britannica') },
	gheys: async function() { return await import('./gheys') },
	gekaaptebrieven: async function() { return await import('./gekaaptebrieven') },
	kranten1700: async function() { return await import('./kranten1700') },
	'plakaatboek-guyana-1670-1816': async function() { return await import('./plakaatboek-guyana-1670-1816') },
	henegouwseregisters: async function() { return await import('./henegouwseregisters') },
	utrechtpsalter: async function() { return await import('./utrechtpsalter') },
	vangogh: async function() { return await import('./vangogh') },
} as Record<string, () => Promise<{ default: DocereConfigData }>>

export default  {
	achterdeschermen: async function() { return await import('./achterdeschermen') },
	'encyclopaedia-britannica': async function() { return await import('./encyclopaedia-britannica') },
	gheys: async function() { return await import('./gheys') },
	gekaaptebrieven: async function() { return await import('./gekaaptebrieven') },
	kranten1700: async function() { return await import('./kranten1700') },
	utrechtpsalter: async function() { return await import('./utrechtpsalter') },
	vangogh: async function() { return await import('./vangogh') },
} as Record<string, () => Promise<{ default: DocereConfigData }>>

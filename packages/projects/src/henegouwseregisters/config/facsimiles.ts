import { ConfigEntry } from '@docere/common'

function getRectoVersoSequence(x: string) {
	const [start, end] = x.split('-')
	const [,startNoString, startVersorecto] = /(\d+)(r|v)/.exec(start)
	const startNo = parseInt(startNoString, 10)

	// @ts-ignore
	if (end == null) return [`${startNo}${startVersorecto}`.padStart(4, '0')]
	const [,endNoString, endVersorecto] = /(\d+)(r|v)/.exec(end)
	const endNo = parseInt(endNoString, 10)

	const rvString = `${startNo}${startVersorecto}-${endNo}${endVersorecto}`

	if (endNo < startNo) return []
	if (startNo === endNo && startVersorecto === 'v' && endVersorecto === 'r') return []

	let no = startNo
	let versorecto = startVersorecto
	const seq = []
	while (`${seq[0]}-${seq[seq.length - 1]}` !== rvString) {
		seq.push(`${no}${versorecto}`)
		if (versorecto === 'v') {
			no = no + 1
			versorecto = 'r'
		} else {
			versorecto = 'v'
		}
	}
	// @ts-ignore
	return seq.map(x => x.padStart(4, '0'))
}

export default function extractFacsimiles(entry: ConfigEntry) {
	const [region, entryId] = entry.id.split('/')

	const registers = Array.from(entry.document.querySelectorAll('register')).map(k => k.textContent).filter(x => x.length > 0)
	const tmp = registers
		.map(register => {
			const result = /(.*?)\s\((.*?)\), f. (.*), nr. (\d+)/.exec(register)
			if (result == null) return null
			const [,code,grootklein,folia, nr] = result
			const [regioCode, n] = entryId.split('_')
			return {
				regioCode: regioCode,
				n,
				code,
				grootklein: grootklein.slice(0, grootklein.indexOf(' ')),
				folia,
				nr
			}
		})
		.filter(x => x != null && x.grootklein === 'groot')

	if (!tmp.length) return []

	const x = tmp[0]

	const z = getRectoVersoSequence(x.folia).map((rv,i) => {
		return {
			id: rv,
			versions: [
				{
					path: `/iiif//henegouwseregisters/${region}/${x.regioCode}_G_bewerkt/${x.regioCode}_G_X${rv}_${x.n}_${i + 1}.jpg/info.json`
				}
			]
		}
	})

	return z
}

import { DTAP } from "@docere/common"

/**
 * Map of DTAP value by project ID. Ideally we would like to have
 * the DTAP value only inside the config, but because the config is
 * async loaded per project, the DTAP value is not available at build time.
 * The DTAP value is needed to build different projects on different
 * environments. For example, a DTAP.Acceptance project should not be 
 * build on the DTAP.Production server.
 */
export const dtapMap: Record<string, DTAP> = {
	// Testing => demo.docere.diginfra.net
	// bosscheschepenprotocollen: DTAP.Testing,
	mondrian: DTAP.Testing,
	republic: DTAP.Testing,
	suriano: DTAP.Testing,
	gemeentearchiefkampen: DTAP.Development,
	isidore: DTAP.Development,
	// vangogh: DTAP.Testing,

	// Development => localhost(:4000)
	// 'plakaatboek-guyana-1670-1816': DTAP.Development,
	// florariumtemporum: DTAP.Development,
	// gheys: DTAP.Development,
	// henegouwseregisters: DTAP.Development,
	// isidore: DTAP.Development,
	// kranten1700: DTAP.Development,

	// Inactive
	// ecodicesnl
	// utrechtpsalter
	// gekaaptebrieven
}

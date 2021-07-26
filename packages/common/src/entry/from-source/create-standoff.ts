import { DocereConfig, PartialStandoff, StandoffWrapper } from "../.."

/**
 * Create {@link PartialStandoff} from 'any' source
 * 
 * @param source 
 * @param projectConfig 
 * @returns 
 * 
 * @todo rename file to create-standoff.ts
 * @todo move to @docere/common?
 */
export function createStandoff(standoff: PartialStandoff, projectConfig: DocereConfig) {
	const standoffWrapper = new StandoffWrapper(standoff)

	projectConfig.standoff.prepareAnnotations(standoffWrapper)

	return standoffWrapper.standoff
}

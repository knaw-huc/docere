import { useHistory, useParams, useLocation } from "react-router-dom"
import { getPath } from '@docere/common'

import type { NavigatePayload } from '@docere/common'

export function useNavigate() {
	const history = useHistory()
	const { projectId } = useParams()

	return function navigate(payload: NavigatePayload) {
		history.push(getPath(payload.type, projectId, payload.id, payload.query))
	}
}

export function useQuery() {
	const x: Record<string, string> = {}
	for (const [key, value] of new URLSearchParams(useLocation().search)) {
		x[key] = value
	}
	return x
}

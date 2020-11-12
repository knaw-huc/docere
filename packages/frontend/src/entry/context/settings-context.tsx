import React from 'react'
import { DocereConfig, defaultEntrySettings, ProjectContext, EntrySettingsContext } from '@docere/common'

export function EntrySettingsProvider(props: { children: React.ReactNode }) {
	const { config } = React.useContext(ProjectContext)
	const [settings, setSettings] = React.useState<DocereConfig['entrySettings']>(defaultEntrySettings)

	const toggleSetting = React.useCallback((prop: keyof DocereConfig['entrySettings']) => {
		setSettings({
			...settings,
			[prop]: !settings[prop]
		})
	}, [settings])

	React.useEffect(() => {
		setSettings(config.entrySettings)
	}, [config.slug])

	return (
		<EntrySettingsContext.Provider value={{ settings, toggleSetting }}>
			{props.children}
		</EntrySettingsContext.Provider>
	) 
}

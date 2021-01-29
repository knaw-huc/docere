import { Language } from '../../enum'
import english from './en'
import dutch from './nl'

export type LanguageMap = Record<keyof typeof english, string>

export const languageMaps = {
	[Language.EN]: english,
	[Language.NL]: dutch,
}

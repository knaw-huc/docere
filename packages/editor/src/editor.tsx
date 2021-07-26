import React, { useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'

interface EditorProps {
	language: string,
	value: string,
}
export function Editor({ language, value }: EditorProps) {
	const divEl = useRef<HTMLDivElement>(null)
	const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>()

	useEffect(() => {
		if (divEl.current == null) return

		editorRef.current = monaco.editor.create(divEl.current, { automaticLayout: true })

		return () => editorRef.current.dispose()
	}, [])

	useEffect(() => {
		const model = monaco.editor.createModel('', language)
		model.onDidChangeContent(() => {
			setTimeout(() => {
				editorRef.current.getAction('editor.action.formatDocument').run()
			}, 100)
		})
		editorRef.current.setModel(model)
	}, [language])

	useEffect(() => {
		const model = editorRef.current.getModel()
		model.setValue(value)
	}, [value])

	return <div className="Editor" ref={divEl}></div>
}

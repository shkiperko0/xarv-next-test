import statics from "src/statics"
import { IFolderRecords, useDir } from '.'
import styles from "./styles.module.scss"

export async function uploadForm(form: HTMLFormElement): Promise<IFolderRecords> {
	try {
		const res = await fetch(form.action, {
			method: 'POST',
			//mode: 'no-cors',
			body: new FormData(form)
		})
		console.log({res})
		const json = await res.json()
		console.log({ json })
		return json
	}
	catch (error) {
		console.error(error)
	}

	return []
}

interface IUploaderProps{
	onUpload?: () => void
}

export function Uploader(props: IUploaderProps) {
	const dir = useDir()
	if(!dir) return <>Uploader not in folder!?</>

	async function sendFiles(form: HTMLFormElement){
		const files = await uploadForm(form)
		if(dir){
			files.forEach(record => dir.addRecord(record))
			dir.setOpened(true)
		}
	}

	return <form action={`${statics.host.contentMS}${dir.path}`}>
		<input type="file" name="files" multiple />
		<button type='button' className={styles.button + ' ' + styles.upload} onClick={async event=>{
			await sendFiles(event.currentTarget.form!)
			event.preventDefault()
			event.stopPropagation()
			props.onUpload && props.onUpload()
		}}>upload</button>
	</form>
}

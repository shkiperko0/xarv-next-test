import statics from "../statics";
import utils from '../utils'
import Button from "./gui/Button";

export const Nya = () => <img src={`${statics.host.main}/images/fire.gif`} alt="Nya"/>

interface IUploadProps{
	path: string
}

export function TempUpload(props: IUploadProps){
	return <form 
		action={`${statics.host.api}${props.path}`} 

		onClick={event => event.stopPropagation()}

		onSubmit={ 
			event => {
				event.preventDefault()
				event.stopPropagation()
				utils.uploadForm(event.target as HTMLFormElement)
			}
		}
	>
		<input type="file" name="files" multiple/>
		<Button submit> submit </Button>
	</form>
}

const Some = {
	Nya, TempUpload
}



export default Some
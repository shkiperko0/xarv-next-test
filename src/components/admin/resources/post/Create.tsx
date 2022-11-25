import { Create, FormDataConsumer, SimpleForm, TextInput } from 'react-admin';
import { CreateToolbar, PostCommonEditor } from '../editors';

const defaultValues = { caption: 'Post title', text: 'Sample text', meta: {}, template: 'post'}

export default function(props: any){
	return <>
		<Create title="Create post">
			<SimpleForm defaultValues={defaultValues} toolbar={<CreateToolbar/>}>
				<FormDataConsumer>{fd => <PostCommonEditor data={fd.formData} />}</FormDataConsumer>
			</SimpleForm>
		</Create>
	</>
}
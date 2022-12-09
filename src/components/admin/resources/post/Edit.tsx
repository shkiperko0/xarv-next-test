import { Edit, FormDataConsumer, SimpleForm, TextField, TextInput } from 'react-admin';
import { EditToolbar, PostCommonEditor } from '../editors';

export default function(props: any){
	return <>
		<Edit title="Edit post">
			<SimpleForm defaultValues={{ caption: 'Post title', text: 'Sample text', meta: {}, template: 'post',}} toolbar={<EditToolbar/>}>
				<FormDataConsumer>{ fd => <PostCommonEditor data={fd.formData} /> }</FormDataConsumer>
			</SimpleForm>
		</Edit>
	</>
}

    
   
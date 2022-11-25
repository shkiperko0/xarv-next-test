import { Edit, FormDataConsumer, SimpleForm, TextField, TextInput, useEditContext } from 'react-admin';
import { EditToolbar, PostPageEditor } from '../editors';

const defaultValues = { caption: 'Page title', text: 'Sample text', meta: {}, template: 'post'}

export default function(props: any){
	const { record, isLoading, redirect } = useEditContext();
    if (isLoading) return null;

	return <>
		<Edit title="Edit page">
			<SimpleForm defaultValues={defaultValues} toolbar={<EditToolbar/>}>
				<TextInput disabled source="id" />
				<FormDataConsumer>{ fd => <PostPageEditor data={fd.formData} /> }</FormDataConsumer>
			</SimpleForm>
		</Edit>
	</>
}
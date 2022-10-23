import { Edit, SimpleForm, TextField, TextInput } from 'react-admin';

export default function PostEdit(props: any){
    return <Edit title="Edit a new" >
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="category_id" />
            <TextInput source="caption" />
            <TextField source="image_url" />
            <TextField source="full_text" />
        </SimpleForm>
    </Edit>
}
    
   
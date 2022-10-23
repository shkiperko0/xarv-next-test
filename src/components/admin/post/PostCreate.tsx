import { Create, SimpleForm, TextInput } from 'react-admin';

export default function PostCreate(props: any){
    return <Create title="Create a New" {...props}>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="teaser" options={{ multiline: true }} />
            <TextInput multiline source="body" />
            <TextInput label="Publication date" source="published_at" />
            <TextInput source="average_note" />
        </SimpleForm>
    </Create>
}
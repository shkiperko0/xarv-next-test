import { List, Datagrid, TextField, EditButton, DeleteButton } from 'react-admin';

export default function PostList(props: any){
    return <List {...props}>
        <Datagrid >
            <TextField source="id" />
            <TextField source="caption" />
            <TextField source="category_id" />
            <TextField source="image_url" />
            <TextField source="created_at" />
            <TextField source="text" />
            <EditButton  />
            <DeleteButton />
        </Datagrid>
    </List>
}

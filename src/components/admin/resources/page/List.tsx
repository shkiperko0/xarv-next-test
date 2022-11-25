import { List, Datagrid, TextField, EditButton, DeleteButton } from 'react-admin';

export default function(props: any){
	return <>
		<List {...props}>
			<Datagrid >
				<TextField source="id" />
				<TextField source="status" />
				<TextField source="caption" />
				{/* <TextField source="created_at" />
				<TextField source="text" /> */}
				<EditButton />
				<DeleteButton />
			</Datagrid>
		</List>
	</>
}

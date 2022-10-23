import Head from "next/head";
import { Admin, Resource } from "react-admin";
import PostCreate from "src/components/admin/post/PostCreate";
import PostEdit from "src/components/admin/post/PostEdit";
import PostList from "src/components/admin/post/PostList";
import { ResourceProvider } from "src/components/admin/provider";

export default () => <>
	<Head>
		<title>Админка</title>
	</Head>
	<Admin
		basename='/admin'
		dataProvider={new ResourceProvider()}
	>
		<Resource options={{ label: 'Posts' }} name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
	</Admin>
</>
import Head from "next/head";

import { AdminPanel } from 'src/components/admin'

//import dynamic from 'next/dynamic'
//const NoSSR_Admin = dynamic(() => import('src/components/admin'), { ssr: false })

export default () => {
	return <>
		<Head>
			<title>Admin</title>
		</Head>
		<AdminPanel/>
	</>
}
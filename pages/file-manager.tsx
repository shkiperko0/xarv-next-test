import Head from "next/head";
import FileManager from "src/components/gui/file-manager";
import Page from "src/components/Page";

export default () => <>
    <Head>
		<title>Файловый менеджер</title>
	</Head>
    <Page name='file-manager'>
        <FileManager/>
    </Page>
</>

import Head from "next/head";
import GalleryView from "src/components/gui/gallery";
import Page from "src/components/Page";

export default () => <>
    <Head>
		<title>Галерея</title>
	</Head>
    <Page name='gallery-view'>
        <GalleryView path='/dir/images' />
    </Page>
</>

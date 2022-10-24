import Head from "next/head";
import Page from "src/components/Page";
import { WiwManager } from "src/components/WiwManager";

export default () => <>
    <Head>
        <title>Редактор прав и ролей</title>
    </Head>
    <Page>
        <WiwManager />
    </Page>
</>
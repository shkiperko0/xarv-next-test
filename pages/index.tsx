import Head from "next/head";
import Page from "src/components/Page";

import styles from "src/Common.module.scss"
import PostsPreview from "src/components/PostPreview";

const aside = <aside className={styles.aside}></aside>

export default () => <>
  <Head>
    <title>Главная</title>
  </Head>
    <Page name='main'>
      <div className={styles.content}>
        <PostsPreview/>
      </div>
    </Page>
</>
    
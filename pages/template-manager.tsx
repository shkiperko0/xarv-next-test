import Head from "next/head";
import { useState } from "react";
import { MetaEditor } from "src/components/MetaEditor";
import Page from "src/components/Page";
import TemplateManager, { GetTemplateSchema, IPostMeta, IPostProps, _templateList } from "src/components/TemplateManager";

export default () => {
    const [ template, setTemplate ] = useState<string>('default')
    const [ meta, setMeta ] = useState<IPostMeta>({})

    const scheme = GetTemplateSchema(template)

    const props: IPostProps = {
        id: 1, 
        category_id: 1,
        created_at: '',
        image_url: '',
        user_id: 1,
        caption: 'Some caption',
        meta,
        template,
        text: 'some text',
    }

    return <>
        <Head>
            <title>Редактор прав и ролей</title>
        </Head>
        <Page>
            <select onChange={
                event => {
                    setTemplate(event.currentTarget.value)
                }
            }>
                { Object.keys(_templateList).map(template =>
                    <option value={template}>{template}</option>) }
            </select>
            <MetaEditor 
                data={meta} setData={setMeta} scheme={scheme}
            />
            <TemplateManager template={template} meta={meta} props={props} />
        </Page>
    </>
}
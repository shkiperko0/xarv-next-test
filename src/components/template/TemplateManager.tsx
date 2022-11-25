import { IMetaScheme, GetSchemeFromData } from "./MetaEditor"
import { IPostProps } from "./types"

interface ITemplateList{
    [template: string]: (props: IPostProps<any>) => JSX.Element
} 

interface ISchemeList{
    [template: string]: IMetaScheme
} 

const _templateList: ITemplateList = {
    ['default']: () => <>Default Template</>
    // ['post']: Article,
    // ['welcome']: Welcome,
    // ['post-preview']: PostPreview,
    // ['test']: Test,
    // ['multi-post']: MultiPost,
}

const _schameList: ISchemeList = {
    ['default']: {}, // GetSchemeFromData({preview: 'preview'}),
    // ['test']: GetSchemeFromData(TestMock),
    //['multi-post']: MultiPostScheme,
    // ['post']: {},
    // ['welcome']: GetSchemeFromData(WelcomeMock),
}

// export function RegisterTemplate(name: string, element: (_: IPostProps) => JSX.Element, mock: any, scheme?: IMetaScheme){
//     _templateList[name] = element
//     _schameList[name] = scheme ?? mock ? GetSchemeFromData(mock) : {}
// }

// console.log({ welcome_scheme: _schameList.welcome })
// console.log({ defaultValues: GetKeyDefaultValue({ type: 'object', scheme: _schameList.test }) })
// console.log({ welcome_normalized: NormalizeMeta(undefined, { type: 'object', scheme: _schameList.welcome })})

export const GetTemplates = () => 
    Object.keys(_templateList).map((name, id) => ({id, name}))

export const GetTemplateComponent = (template: string) => 
    (_templateList[template] ?? _templateList['default'] ?? (() => <>Unknown template: {template}</>))

export function GetTemplateSchema(template: string){
    return _schameList[template] ? 
        { ... _schameList['default'], ..._schameList[template] } :  _schameList['default']
}

export function TemplateManager(props: IPostProps){
    const { data } = props
    if(data){
        const Render = GetTemplateComponent(data.template)
        return <Render {...props} />
    }
    return <>Template manager: No data</>
}

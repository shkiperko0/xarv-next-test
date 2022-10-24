import { IMetaScheme } from "./MetaEditor"
import MultiPost from "./MultiPost"
import { FullPost, PostPreview } from "./PostPreview"

export interface IPostMeta{ 
    [name: string]: any 
}

export interface IPostProps{
    id: number,
    user_id: number,
    caption: string,
    category_id: number,
    created_at: string,
    text: string, 
    image_url: string,
    template: string,
    meta: IPostMeta,
}

interface ITemplateList{
    [template: string]: (props: any) => JSX.Element
} 

interface ISchemeList{
    [template: string]: IMetaScheme
} 
  
export const _templateList: ITemplateList = {
    ['default']: FullPost,
    ['post']: FullPost,
    ['post-preview']: PostPreview,
    ['multi-post']: MultiPost,
}

export const _schameList: ISchemeList = {
    ['default']: { preview: 'string' },
    ['test']: { one: 'number', two: 'string' },
    ['multi-post']: { posts: 'number[]' },
    ['post']: {},
}

export const _templateMeta = {
    ['default']: ['preview'],
    ['test']: [],
    ['multi-post']: ['posts'],
    ['post']: [],
}
  
export interface ITemplateManagerProps{
    template: string,
    props: any,
    meta?: IPostMeta
}

let i = 0
export const GetTemplates = () =>  Object.entries(_templateList).map(function (e){ return {id: i++, name: e[0]} })

export function GetTemplateComponent(template: string){
    return _templateList[template] ?? _templateList['default']
}

export function GetTemplateSchema(template: string){
    return _schameList[template] ? 
        { ... _schameList['default'], ..._schameList[template] } : 
        _schameList['default']
}

export function GetTemplateMeta(template: string){
    return (template == 'default') ? _templateMeta[template] : [..._templateMeta['default'], ..._templateMeta[template] ?? []]
}
  
export default function TemplateManager(props: ITemplateManagerProps){
    const { props: data, template, meta } = props
    const MyComponent = GetTemplateComponent(template)
    return <MyComponent {...data}/>
}
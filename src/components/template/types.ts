export enum EPostStatuses{
	publish,
	future, 
	draft, 
	pending, 
	private, 
	trash, 
	'auto-draft',
	inherit, 
}

export enum EPostType{
    post,
    page
}

export type TPostType = keyof typeof EPostType
export type TPostStatuses = keyof typeof EPostStatuses

export interface IPostMeta{ 
    [name: string]: any 
}

export interface IPostData<Meta=IPostMeta>{
    id: number,
    user_id: number,
    caption: string,
    category_id: number | null,
    created_at: string,
    text: string, 
    image_url: string,
    template: string,
    meta?: Meta,
    type: TPostType,
    status: TPostStatuses,
}

export interface IPostProps<Type = any>{
    data: IPostData<Type>
}

export default {}
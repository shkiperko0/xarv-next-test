export interface Params_ID{
	id: number
}

export interface Response_ID{
	id: number
}

export interface Params_List{
	limit: number,
	offset: number,
	count?: true,
}

export interface Params_Paged{
	page: number,
	perpage: number,
}

export interface Response_List<Type=never>{
    list: Type[],
    count?: number
}

import { CreateParams, CreateResult, DeleteManyParams, DeleteManyResult, DeleteParams, DeleteResult, GetListParams, GetListResult, GetManyParams, GetManyReferenceParams, GetManyReferenceResult, GetManyResult, GetOneParams, GetOneResult, PaginationPayload, UpdateManyParams, UpdateManyResult, UpdateParams, UpdateResult } from 'react-admin';
import statics from 'src/statics';
import { getRefreshToken } from 'src/tools';

export interface ResourceController{
    getOne(params: GetOneParams): Promise<GetOneResult>
    getList(params: GetListParams): Promise<GetListResult> 
    getMany(params: GetManyParams): Promise<GetManyResult> 
    getManyReference(params: GetManyReferenceParams): Promise<GetManyReferenceResult> 
    update(params: UpdateParams): Promise<UpdateResult> 
    updateMany(params: UpdateManyParams): Promise<UpdateManyResult> 
    create(params: CreateParams): Promise<CreateResult> 
    delete(params: DeleteParams): Promise<DeleteResult> 
    deleteMany(params: DeleteManyParams): Promise<DeleteManyResult> 
}

export const main_api = statics.host.api

async function proxyHttpClient(input: RequestInfo | URL, init?: RequestInit | undefined){
    const res = await fetch(input, init)

    if((res.status - (res.status % 200)) !== 200) 
            throw Error(res.statusText)

    return res
}

export const httpClient = proxyHttpClient // fetch

export function pagination_to_lo(pagination: PaginationPayload){
    return {
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage
    }
}
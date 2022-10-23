import { CreateParams, CreateResult, DeleteManyParams, DeleteManyResult, DeleteParams, DeleteResult, GetListParams, GetListResult, GetManyParams, GetManyReferenceParams, GetManyReferenceResult, GetManyResult, GetOneParams, GetOneResult, PaginationPayload, UpdateManyParams, UpdateManyResult, UpdateParams, UpdateResult } from 'react-admin';
import statics from 'src/statics';

const { host: { api: contentMS }} = statics

function getCookie(name: string) {
    const cookie = document.cookie
    const rows = cookie.split('; ')
    const row = rows.find((row) => row.startsWith(`${name}=`))
    const value = row?.split('=')[1]; 
    //debugger
    return value
}
  

async function proxyHttpClient(input: RequestInfo | URL, init?: RequestInit | undefined){
    const res = await fetch(input, init)

    if((res.status - (res.status % 200)) !== 200) 
            throw Error(res.statusText)

    return res
}


const httpClient = proxyHttpClient // fetch

interface ResourceController{
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

function pagination_to_lo(pagination: PaginationPayload){
    return {
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage
    }
}

const auth_header = {
    Authorization: `Bearer ${getCookie('refreshToken')}`,
    'Content-Type': 'application/json'
}

class postsController implements ResourceController{
    async getMany(params: GetManyParams): Promise<GetManyResult<any>> {
        throw new Error('Method not implemented.');
    }

    async getManyReference(params: GetManyReferenceParams): Promise<GetManyReferenceResult<any>> {
        throw new Error('Method not implemented.');
    }

    async updateMany(params: UpdateManyParams<any>): Promise<UpdateManyResult<any>> {
        throw new Error('Method not implemented.');
    }

    async create(params: CreateParams<any>): Promise<CreateResult<any>> {
        throw new Error('Method not implemented.');
    }

    async deleteMany(params: DeleteManyParams<any>): Promise<DeleteManyResult<any>> {
        throw new Error('Method not implemented.');
    }

    async getOne(params: GetOneParams<any>): Promise<GetOneResult<any>> {
        const res = await httpClient(`${contentMS}/posts/${params.id}`, {
            headers: { ...auth_header },
            method: 'GET',            
        })
        return {
            data: await res.json()
        }
    }

    async update(params: UpdateParams<any>): Promise<UpdateResult<any>> {
        const {category_id, caption, image_url, full_text, preview_text} = params.data
        const dto = { category_id, caption, image_url, full_text, preview_text }
          
        /* const res = */await httpClient(`${contentMS}/posts/edit/${params.id}`, {
            headers: { ...auth_header },
            method: 'POST',
            body: JSON.stringify(dto)
        })

        return { data: { id: params.id } }
    }

    async delete(params: DeleteParams<any>): Promise<DeleteResult<any>> {
        /*const res = */await httpClient(`${contentMS}/posts/${params.id}`, {
            headers: { ...auth_header },
            method: 'DELETE'
        })

        return {
            data: {}
        }
    }
    async getList(params: GetListParams): Promise<GetListResult> {
        const { limit, offset } = pagination_to_lo(params.pagination)
        const res = await httpClient(`${contentMS}/posts/list`, {
            headers: { ...auth_header },
            method: 'POST', 
            body: JSON.stringify({
                sort: params.sort,
                limit, offset,
                count: true,
            })
        })

        const data: { posts: any[], count?: number} = await res.json() 

        return {
            data: data.posts,
            total: data.count ?? 0
        }
    }
}

const ResourceControllers: {
    [name: string]: ResourceController
} = {
    posts: new postsController()
}

function getResourceController(name: string): ResourceController {
    const controller = ResourceControllers[name]
    if(!controller) throw Error(`Invalid resource controller (${name})`)
    return controller
}

export class ResourceProvider{
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        return await getResourceController(resource).getList(params)
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        return await getResourceController(resource).getOne(params)       
    }

    async getMany(resource: string, params: GetManyParams): Promise<GetManyResult> {
        return getResourceController(resource).getMany(params)
    }

    async getManyReference(resource: string, params: GetManyReferenceParams): Promise<GetManyReferenceResult> {
        return getResourceController(resource).getManyReference(params)
    }

    async update(resource: string, params: UpdateParams): Promise<UpdateResult> {
        return getResourceController(resource).update(params)
    }
        
    async updateMany(resource: string, params: UpdateManyParams): Promise<UpdateManyResult> {
        return getResourceController(resource).deleteMany(params)
    }

    async create(resource: string, params: CreateParams): Promise<CreateResult> {
        return getResourceController(resource).create(params)
    }

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
        return getResourceController(resource).delete(params)
    }

    async deleteMany(resource: string, params: DeleteManyParams): Promise<DeleteManyResult> {
        return getResourceController(resource).deleteMany(params)
    }
}

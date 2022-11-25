import { CreateParams, CreateResult, DeleteManyParams, DeleteManyResult, DeleteParams, DeleteResult, GetListParams, GetListResult, GetManyParams, GetManyReferenceParams, GetManyReferenceResult, GetManyResult, GetOneParams, GetOneResult, PaginationPayload, UpdateManyParams, UpdateManyResult, UpdateParams, UpdateResult } from 'react-admin';
import { IPostData } from '@components/template/types';
import statics from 'src/statics';
import { httpClient, pagination_to_lo, ResourceController } from ".";
import { PostsController } from './posts';
import { Header_Auth_JSON } from 'src/tools';

const ms = statics.host.api

export class PagesController extends PostsController {

    async getMany(params: GetManyParams): Promise<GetManyResult<IPostData>> {
        throw new Error("Method not implemented.");
    }

    async getManyReference(params: GetManyReferenceParams): Promise<GetManyReferenceResult<IPostData>> {
        throw new Error("Method not implemented.");
    }

    async updateMany(params: UpdateManyParams<IPostData>): Promise<UpdateManyResult<IPostData>> {
        throw new Error("Method not implemented.");
    }
 
    async deleteMany(params: DeleteManyParams<IPostData>): Promise<DeleteManyResult<IPostData>> {
        throw new Error('Method not implemented.');
    }

    async getOne(params: GetOneParams<IPostData>): Promise<GetOneResult<IPostData>> {
        const res = await httpClient(`${ms}/api/v1/content/posts/${params.id}`, {
            headers: Header_Auth_JSON(),
            method: 'GET',            
        })
        return {
            data: await res.json()
        }
    }

    async update(params: UpdateParams<IPostData>): Promise<UpdateResult<IPostData>> {
        const { data: { caption, category_id, image_url, meta, template, text, status }, id } = params
        const dto = { caption, category_id, image_url, meta, template, text, status } 
        const res = await httpClient(`${ms}/api/v1/content/edit-post/${id}`, {
            headers: Header_Auth_JSON(),
            method: 'POST',
            body: JSON.stringify(dto)
        })
        return { data: await res.json() }
    }

    async delete(params: DeleteParams<IPostData>): Promise<DeleteResult<IPostData>> {
        const res = await httpClient(`${ms}/api/v1/content/delete-posts/${params.id}`, {
            headers: Header_Auth_JSON(),
            method: 'DELETE',
            body: '{}'
        })

        return {
            data: {} as any
        }
    }

    async create(params: CreateParams<IPostData>): Promise<CreateResult<IPostData>> {
        const { caption, image_url, text, template, meta, status } = params.data
        const dto = { category_id: null, caption, image_url, text, template, meta, type: 'page', status } as IPostData
          
        const res = await httpClient(`${ms}/api/v1/content/create-posts`, {
            headers: Header_Auth_JSON(),
            method: 'POST',
            body: JSON.stringify(dto)
        })

        return { data: await res.json() }
    }

    async getList(params: GetListParams): Promise<GetListResult<IPostData>> {
        const { limit, offset } = pagination_to_lo(params.pagination)
        const res = await httpClient(`${ms}/api/v1/content/posts-list`, {
            headers: Header_Auth_JSON(),
            method: 'POST', 
            body: JSON.stringify({
                sort: params.sort,
                limit, offset,
                count: true,
                type: 'page',
            })
        })

        const data: { posts: any[], count?: number} = await res.json() 

        return {
            data: data.posts,
            total: data.count ?? 0
        }
    }
}
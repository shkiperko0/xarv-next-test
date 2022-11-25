import { Admin, Resource } from "react-admin";
import { ResourceProvider } from "@components/admin/provider";

import PostCreate from './resources/post/Create'
import PostEdit from './resources/post/Edit'
import PostList from './resources/post/List'

import PagesCreate from './resources/page/Create'
import PagesEdit from './resources/page/Edit'
import PagesList from './resources/page/List'
import { G_StorageContrext, IGStorageData, initStorage } from "src/contexts/storage";
import { useEffect, useState } from "react";

export function AdminPanel(){  
    const [storage, setStorage] = useState<IGStorageData>(null as any)
    const isLoading = storage == null

    useEffect(() => { initStorage(storage, setStorage) }, [isLoading])

    if(isLoading){
        return <>
            isLoading
        </>
    }
    
    return <>
        <G_StorageContrext.Provider value={{isLoading, storage, setStorage}}>
            <Admin basename='/admin' dataProvider={new ResourceProvider()} >
                <Resource name="posts" options={{ label: 'Posts' }} list={PostList} edit={PostEdit} create={PostCreate} />
                <Resource name="pages" options={{ label: 'Pages' }} list={PagesList} edit={PagesEdit} create={PagesCreate} />  
            </Admin>
        </G_StorageContrext.Provider>
    </>
}
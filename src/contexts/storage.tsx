import { createContext, Dispatch, SetStateAction, useContext } from "react"
import statics from "src/statics"
import { fetchJSON } from "src/tools"

interface IContentCategory{
  id: number,
  name: string,
  title: string
}

export interface IGStorageData{
  content: {
    categories: IContentCategory[]
  }
}

interface IGStorageContext{
  isLoading: boolean, 
  storage: IGStorageData, 
  setStorage: Dispatch<SetStateAction<IGStorageData>> 
}

export async function initStorage(value: IGStorageData, cb: Dispatch<SetStateAction<IGStorageData>>){
  console.log('initStorage', value)
  if(value == null){ cb({

      content: {
        categories: await fetchJSON<IContentCategory[]>('GET', `${statics.host.api}/api/v1/content/categories`)
      }

  })}
}

export const G_StorageContrext = createContext<IGStorageContext>(null as any)
export const useGStorage = () => useContext(G_StorageContrext)
    
import { createContext, Dispatch, SetStateAction, useContext } from "react"
import statics from "src/statics"


interface IContentCategory{
  id: number,
  name: string,
  title: string
}

type IPostCategories = IContentCategory[]

export interface IGStorageData{
  content: {
    categories: IPostCategories
  }
}

export function findByKey<T>(array_of: T[], key: keyof T, value: any){
    return array_of.find((item: T) => (item[key] === value))
}

export function keyByValue(object: object, value: any){
  return Object.entries(object).find((entry) => entry[1] == value)?.[0]
}
  
interface IGStorageContext{
  isLoading: boolean, 
  storage: IGStorageData, 
  setStorage: Dispatch<SetStateAction<IGStorageData>> 
}

async function fetch_Categories() {
  const res = await fetch (`${statics.host.api}/api/v1/content/categories`, {
    method: "GET",
  })
  return await res.json()
}

export async function initStorage(value: IGStorageData, cb: Dispatch<SetStateAction<IGStorageData>>){
  console.log('initStorage', value)
  if(value == null){ cb({

      content: {
        categories: await fetch_Categories() as IPostCategories
      }

  })}
}

export const G_StorageContrext = createContext<IGStorageContext>(null as any)
export const useGStorage = () => useContext(G_StorageContrext)
    
import { DataChangeHandler, DataConstructor } from "@components/dataconstructor"
import statics from "src/statics"
import { useJSONFetch } from "src/tools"
import { DefaultArrayFetcher, IServiceMenuProps, ServiceMenu, styles } from ".."

const data = {}

export function DataEditorTest(){

    const onChange: DataChangeHandler = () => {

    }


    return <>
        <DataConstructor data={data} onChange={onChange} />
    </>
}
import Dir from "./Dir"
import File from "./File"

const records: {
    [name: string]: (props: any) => JSX.Element
} = {
    'file': File,
    'dir': Dir
}

export interface IRecordProps{ 
    name: string, 
    type: string,
    path: string
}

export default function Record(props: IRecordProps){
    const Component = records[props.type]
    return Component ? <Component {...props}/> : <></>
}
  

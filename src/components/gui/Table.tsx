import { cl } from "src/utils"
import { styles } from "."
import { Button } from "./Button"

export interface ITableRowProps<Type=any>{ 
    data: Type, 
    index: number 
}

export interface ITableProps<Type=any>{
    data: Type[],
    columns?:{
        [name: string]: (props: ITableRowProps) => JSX.Element
    },
    className?: string
}

export function Table(props: ITableProps){
    const { data, columns, className } = props
    const hdr = Object.keys(data.length ? data[0] : {})

    return <table className={cl(styles.table, className)}>
        <thead>
            <tr>
                { hdr.map(hdr => <th><span>{hdr}</span></th>) }
                { columns && Object.keys(columns).map(column => <th>{column}</th>) }
            </tr>
        </thead>
        <tbody>
            { 
                data.map(
                    (row: object, index) => <tr>
                        {  
                            Object.values(row).map(
                                value => <td>
                                    <span>{typeof value == 'object' ? JSON.stringify(value) : value }</span>
                                </td>
                            )
                        }
                        { 
                            columns && Object.values(columns).map((Element) => <td><Element data={row} index={index} /></td>)
                        }
                    </tr>
                )
            }
        </tbody>
    </table>
}

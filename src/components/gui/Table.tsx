import { ReactNode } from "react"
import { cl, Type2Text } from "src/tools"
import { styles } from "."

export interface ITableRowProps<Type=any>{ 
    row: Type, 
    index: number,
}

interface ITableHeaderWrapperProps<RowType=any, FieldType=any>{
    field: string,
    value: FieldType,
    index: number,
    row: RowType,
    children?: ReactNode,
}

interface ITableCellWrapperProps<RowType=any, FieldType=any>{
    field: string,
    value: FieldType,
    index: number,
    row: RowType,
    children?: ReactNode,
}

export interface ITableProps<Type=any>{
    data: Type[],
    columns?:{
        [name: string]: (props: ITableRowProps) => JSX.Element
    },
    headers?:{
        [name: string]: string
    }
    className?: string,
    headerWrapper?(props: ITableHeaderWrapperProps): JSX.Element
    cellWrapper?(props: ITableCellWrapperProps): JSX.Element
}

function DefaultWrapper(props: ITableCellWrapperProps){
    const { value } = props
    return <span>{Type2Text(value, typeof value)}</span>
}

export function Table(props: ITableProps<object>){
    const { 
        data, 
        columns, 
        className, 
        cellWrapper: Wrapper = DefaultWrapper,
        headers = {}
    } = props

    const frow = data.length ? data[0] : null
    const hdr = frow ? Object.keys(frow) : []

    return <table className={cl(styles.table, className)}>
        <thead>
            <tr>
                { hdr.map((hdr) => <th key={hdr} ><span>{headers[hdr] ?? hdr}</span></th>) }
                { columns && Object.keys(columns).map((column) => <th key={column}>{column}</th>) }
            </tr>
        </thead>
        <tbody>
            { 
                data.map(
                    (row: object, index) => <tr key={index}>
                        {  
                            Object.entries(row as any).map(
                                ([field, value], index) => <td key={field}>
                                    <Wrapper field={field} value={value} row={row} index={index} /> 
                                </td>
                            )
                        }
                        { 
                            columns && Object.entries(columns).map(
                                ([field, Element], index) => <td key={field}>
                                    <Element row={row} index={index} />
                                </td>
                            )
                        }
                    </tr>
                )
            }
        </tbody>
    </table>
}

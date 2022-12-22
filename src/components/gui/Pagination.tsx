import { useMemo, useState } from "react"
import { styles } from "."
import { Button } from "./Button"

interface IPaginationProps{
    count: number,
    perpage: number,
    onChange?(page: number): void,
    currentPage?: number
}

interface IPaginationElementProps{
    page: number,
}

export function Pagination(props: IPaginationProps){
    const { count, onChange, perpage, currentPage } = props
    const [] = useState(currentPage ?? 0)

    const count_pages = Math.ceil(count / perpage)

    function Element(props: IPaginationElementProps){
        return <Button className={styles.paginationelement} onClick={() => { onChange && onChange(props.page) } }> {props.page} </Button>
    }

    function CalcElements(){
        const list: JSX.Element[] = []
        for(let i = 0 ; i < count_pages; i++)
            list.push(<Element key={i} page={i} />)
        return list
    }

    const elements = useMemo(CalcElements, [count_pages])

    return <div className={styles.pagination}>
        { elements }
    </div>
}
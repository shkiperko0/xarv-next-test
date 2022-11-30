import { ReactNode } from "react"
import { useAuth } from "src/contexts/auth"
import { AuthForm } from "src/forms/auth"

interface IPageLayoutProps{
    children?: ReactNode
}

export function PageLayout(props: IPageLayoutProps){
    const { isLogged } = useAuth()
    return <>
        { (isLogged) ? (props.children) : <AuthForm/> }
    </>
}
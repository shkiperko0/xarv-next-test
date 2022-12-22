import { ReactNode } from "react"

interface IChildrenProps{ 
    children: ReactNode 
}

type IWrapperProps = any & IChildrenProps

interface ISlaggerProps{
    slug: string,
    current: string,
    wprops?: IWrapperProps,
    wrapper?: (props: IWrapperProps) => JSX.Element,
    children?: ReactNode,
}

const DefaultWrapper = (props: IChildrenProps) => <>{props.children}</>

export const Slugger = (props: ISlaggerProps) => {
    const { 
        slug, 
        current, 
        wprops = {}, 
        wrapper: Wrapper = DefaultWrapper, 
        children = "Waring: no JSX passed", 
    } = props

    return <Wrapper {...wprops}>
        <>{ (current == slug) && <>{children}</> }</>
    </Wrapper>
}
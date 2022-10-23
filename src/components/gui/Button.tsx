import React, { MouseEventHandler, ReactNode } from "react"
//import style from "./Button.module.css"

interface IButtonProps{
    name?: string,
    children?: ReactNode,
    onClick?: MouseEventHandler<HTMLButtonElement>,
    submit?: true,
}

export default function Button(props: IButtonProps){
    const type = props.submit ? 'submit' : undefined
    return <button className={`btn ${props.name}`} type={type} onClick={props.onClick}>
        {props.children}
    </button>
}
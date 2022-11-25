import React, { MouseEventHandler, ReactNode } from "react"
import styles from "./styles.module.scss"

interface IButtonProps{
    className?: string
    children?: ReactNode,
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function Button(props: IButtonProps){
    return <button 
        type='button' 
        className={`${styles.button} ${props.className}`} 
        onClick={props.onClick}>
        {props.children}
    </button>
}
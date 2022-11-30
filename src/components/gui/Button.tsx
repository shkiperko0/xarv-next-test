import React, { MouseEventHandler, ReactNode } from "react"
import { cl } from "src/utils"
import { styles } from "."

export interface IButtonProps{
    children?: ReactNode,
    onClick?: MouseEventHandler<HTMLButtonElement>,
    type?: "button" | "submit" | "reset",
    className?: string,
}

export function Button(props: IButtonProps){
    const { children, onClick, type = "button", className } = props
    return <button className={cl(styles.button, className)} type={type} onClick={onClick}>{children}</button>
}
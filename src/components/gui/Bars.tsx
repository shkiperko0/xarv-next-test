import { ReactNode } from "react"
import { cl } from "src/tools"
import { styles } from "."

export interface IChildremProps{
    children?: ReactNode
    className?: string
}

export const SidedDiv = (props: IChildremProps) => <div className={cl(styles.lrbar, props.className)}>{props.children}</div>
export const LeftSide = (props: IChildremProps) => <div className={cl(styles.left, props.className)}>{props.children}</div>
export const RightSide = (props: IChildremProps) => <div className={cl(styles.right, props.className)}>{props.children}</div>

export const Bar = SidedDiv
export const Left = LeftSide
export const Right = RightSide



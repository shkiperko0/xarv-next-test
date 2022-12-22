import { MouseEventHandler, ReactChildren, ReactNode } from "react"
import { cl } from "src/tools"
import { styles } from "."
import { Button } from "./Button"
import { Buttons } from "./Buttons"


interface IDialogElementProps{


}

interface IDialogProps{
   [name: string]: IDialogElementProps
}

export const Dialog = (props: IDialogProps) => {
    return <></>
}

interface IConfirmDialogProps{
    className?: string
    children: ReactNode,
    onAccept: MouseEventHandler,
    onReject: MouseEventHandler,
}

export const ConfirmDialog = (props: IConfirmDialogProps) => {
    return <div className={cl(styles.confirm_dialog)}>
        {props.children}
        <Buttons>
            <Button className={styles.accept_button} onClick={props.onAccept}>Yes</Button>
            <Button className={styles.reject_button} onClick={props.onReject}>No</Button>
        </Buttons>
    </div>
}

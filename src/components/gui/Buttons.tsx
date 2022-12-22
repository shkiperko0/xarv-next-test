import { cl } from 'src/tools'
import { styles } from '.'

interface IButtonsProps{
    className?: string,
    children?: React.ReactNode
}

export function Buttons(props: IButtonsProps){
    return <div className={cl(styles.buttons, props.className)}>{props.children}</div>
}
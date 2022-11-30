import { cl } from 'src/utils'
import { styles } from '.'

interface IButtonsProps{
    className?: string,
    children?: React.ReactNode
}

export default function Buttons(props: IButtonsProps){
    return <div className={cl(styles.buttons, props.className)}>{props.children}</div>
}
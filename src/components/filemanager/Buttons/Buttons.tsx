import styles from './styles.module.scss'

interface IButtonsProps{
    className?: string,
    children?: React.ReactNode
}

export default function Buttons(props: IButtonsProps){
    return <div className={props.className}>{props.children}</div>
}
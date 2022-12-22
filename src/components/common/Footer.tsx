import { ReactNode } from "react"
import styles from './Footer.module.scss'

interface IFooterProps{
    children?: ReactNode
}

export default function Footer(props: IFooterProps){
    return <footer className={styles.footer}>
        {props.children}
    </footer>
}
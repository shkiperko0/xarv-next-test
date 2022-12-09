import { InputHTMLAttributes } from 'react'
import { cl } from 'src/utils'
import { styles } from '.'

interface IMyInputProps{
}

export function Input(props: InputHTMLAttributes<HTMLInputElement> & IMyInputProps){
    const { className, ...defaultProps } = props
    return <input className={cl(styles.input, className)} {...defaultProps} />
}
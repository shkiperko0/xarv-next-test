import { useState, useEffect, MouseEventHandler } from 'react';
import { useBackground } from 'src/contexts/bg';
import { callback, cl } from 'src/tools';
import { styles } from '.';

export interface IOptionData<Type = any> {
    id: number,
    title?: string,
    value: Type,
}

interface IOptionProps<Type = any> extends IOptionData<Type> {
    className?: string,
    onClick: MouseEventHandler
}
// [nubmer,string]


// const options = (typeof _options == 'function') ? _options() : _options


export type ISelectOptions<Type=any> = IOptionData<Type>[] | callback<IOptionData<Type>[]> | callback<Promise<IOptionData<Type>[]>> 
export type ISelectEventHandler<Type=any> = (option: IOptionData<Type>, index: number) => void | Promise<void>

interface ISelectProps<Type = any> {
    className?: string,
    options: ISelectOptions<Type>,
    defaultValue?: Type,
    currentValue?: Type,
    onSelect?: ISelectEventHandler
}

function Option(props: IOptionProps) {
    const { onClick, title, className } = props
    return <div className={styles.optionwrapper}>
        <div className={cl(styles.option, className)} onClick={onClick}>
            {title}
        </div>
    </div>
}

export function Select<Type = any>(props: ISelectProps<Type>) {
    const { options: _options, onSelect, defaultValue, currentValue } = props
    const [ isOpen, setOpened ] = useState(false)
    const [ options, setOptions ] = useState(typeof _options == 'object' ? _options : [])

    const bg = useBackground()

    const getDefaultOption = (list = options) => list.find((({ value }) => value == defaultValue)) ?? list[0]
    const getOptionByValue = (value: any, list = options) => list.find(((option) => option.value == value)) ?? list[0]

    const fetchOptions = async() => {
        const { options } = props
        if(typeof options == 'function'){
            const res = options()
            if(res instanceof Promise){
                res.then((data) => { 
                    setOptions(data) 
                    setCurrentOption(getDefaultOption(data))
                    console.log({ promised: data })
                })
                return
            } 
            setOptions(res)
            setCurrentOption(getDefaultOption(res))
            console.log({ direct: res })
            return
        }
    } 

    useEffect(() => { fetchOptions() }, [])

    //const options = _options.length ? _options : [{ id: 0, title: 'Default', value: undefined } as IOptionData]
    const [_currentOption, setCurrentOption] = useState(getDefaultOption)

    const currentOption = currentValue ? getOptionByValue(currentValue) : _currentOption

    return <>
        <div className={cl(styles.selectwrapper, [styles.active, isOpen], props.className)} onClick={() => setOpened(!isOpen)}>
            <div className={styles.select}>
                { 
                    currentOption 
                    ? <Option
                        className={styles.current}
                        key={currentOption.id}
                        id={currentOption.id}
                        title={currentOption.title ?? `${currentOption.value}`}
                        value={currentOption.value} 
                        onClick={() => {
                            setOpened(true)
                            bg.open(<></>, () => {
                                setOpened(false)
                                bg.close()
                            })
                        }} 
                    />
                    : <Option
                        className={styles.current}
                        key={0}
                        id={0}
                        title={'NO OPTIONS'}
                        value={undefined} onClick={() => {}}
                    />
                }
                {
                    isOpen && <div className={styles.dropdownwrapper}>
                        <div className={styles.dropdown} >
                            {
                                options.map(
                                    (option, index) => <Option
                                        onClick={(event) => {
                                            setCurrentOption(option)
                                            onSelect && onSelect(option, index)
                                            setOpened(false)
                                            bg.close()
                                            console.log({ selected: option })
                                        }}
                                        className={cl(styles.others, [styles.active, option.id == currentOption.id])}
                                        key={option.id}
                                        id={option.id}
                                        title={option.title ?? `${option.value}`}
                                        value={option.value}
                                    />
                                )
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
        {
            // isOpen && <div
            //     className={styles.fakeBg}
            //     onClick={() => setOpened(false)}
            // />
        }
    </>
}

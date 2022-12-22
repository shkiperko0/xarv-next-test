import { LeftSide, RightSide, SidedDiv } from "@components/gui/Bars"
import { Button } from "@components/gui/Button"
import { Buttons } from "@components/gui/Buttons"
import { createContext, CSSProperties, MouseEventHandler, ReactNode, useContext, useRef, useState } from "react"
import { callback, cl } from "src/tools"
import { EventEmitter } from "stream"
import styles from "./styles.module.scss"

export { styles }

let window_id = 0;
const NewWindowID = () => (window_id++)

interface IWindowOptions{
    x: number | string,
    y: number | string,
    h: number | string,
    w: number | string,
    title: string,
    className?: string,
    wrapperprops?: any,
    wrapper?: (props: { children: ReactNode }) => JSX.Element
    style?: CSSProperties,
    onClose?: MouseEventHandler
}

interface IWindow{
    id: number,
    content: JSX.Element,
    options: IWindowOptions
}

interface ITaskManagerContext{
    windows: IWindow[],
    create(): IWindow,
    add(window: IWindow): void,
    open(content: JSX.Element, options: IWindowOptions): void,
    close(id: number): void,
}

const TaskManagerContext = createContext<ITaskManagerContext>(null as any)
export const useWindows = () => useContext(TaskManagerContext)

interface ITaskProps{
    data: IWindow
}

const Task = (props: ITaskProps) => {
    return <>
        <div className={styles.task}>
            { props.data.options.title ?? "WND" }
        </div>
    </>
}

interface IWindowProps{
    data: IWindow
}

interface IPoint{
    x: number,
    y: number,
}

interface IRect{
    top: number,
    left: number,
    bottom: number,
    right: number
}

function MakePointInRect(point: IPoint, rect: IRect){
    return { 
        x: ((point.x < rect.left) ? rect.left : (point.x > rect.right ) ? rect.right : point.x),
        y: ((point.y < rect.top) ? rect.top : (point.y > rect.bottom) ? rect.bottom : point.y),
    }
}

const DefaultWindowWrapper = (props: { children: ReactNode }) => {
    return <>
        {props.children}
    </>
}

const Window = (props: IWindowProps) => {
    const { close } = useWindows()
    const [ isDown, setIsDown ] = useState(false)
    const ref = useRef<HTMLElement | undefined>(undefined)

    const [ options, setOptions ] = useState(props.data.options)


    const tr_x = (options.x === 'center') ? 'translateX(-50%)' : null
    const tr_y = (options.y === 'center') ? 'translateY(-50%)' : null
    let transform = (tr_x || tr_y) ? [tr_x, tr_y].join(' ') : undefined

    const x = (typeof options.x == 'number') ? (options.x + 'px') : ( options.x === 'center' ? '50%' : options.x )
    const y = (typeof options.y == 'number') ? (options.y + 'px') : ( options.y === 'center' ? '50%' : options.y )

    const { style = {}, className, wrapper: Wrapper = DefaultWindowWrapper, wrapperprops = {} } = options

    return <Wrapper {...wrapperprops}>
        <div 
            ref={ref as any}
            className={cl(styles.window, className)} 
            style={{ 
                ...style,
                '--w': (typeof options.w == 'number') ? ( options.w + 'px') : options.w,
                '--h': (typeof options.h == 'number') ? ( options.h + 'px') : options.h,
                left: x, 
                top: y,
                transform
            } as any}
        >
            <div 
                className={styles.windowheader}
                onMouseUp={() => setIsDown(false)}
                onMouseDown={() => setIsDown(true)}
                onMouseLeave={() => setIsDown(false)}
                onMouseMove={(event) => {
                    event.preventDefault();
                    if (isDown && ref.current) {
                        const { movementX, movementY } = event
                        const rect = ref.current.getBoundingClientRect();
                        const pos = { x: (rect.x + movementX), y: (rect.y + movementY) }
                        const border = { top: 0, left: 0, bottom: window.innerHeight - (rect.bottom - rect.top), right: window.innerWidth - (rect.right - rect.left) }
                        setOptions({
                            ...options,
                            ...MakePointInRect(pos, border)
                        })
                    }
                }}
            >
                <SidedDiv>
                    <LeftSide><span title={`Window #${props.data.id}`}>{options.title}</span></LeftSide>
                    <RightSide>
                        <Buttons>
                            <Button className={styles.close_button} onClick={(event) => { 
                                close(props.data.id) 
                                props.data.options.onClose && props.data.options.onClose(event)
                            }}/>
                        </Buttons>
                    </RightSide>
                </SidedDiv>    
            </div> 
            <div 
                className={styles.windowcontent} 
                style={{
                    height: 'var(--h)',
                    width: 'var(--w)',
                }}
            >
                {props.data.content}
            </div>
        </div>
    </Wrapper>
}

const Windows = () => { 
    const { windows } = useWindows()
 
    return <>
        <div className={styles.windows}>
            { windows.map((window) => <Window key={window.id} data={window}/>) }
        </div>
    </>
}

const Tasks = () => { 
    const { windows } = useWindows()
 
    return <>
        <div className={styles.windows}>
            { windows.map((window) => <Task key={window.id} data={window}/>) }
        </div>
    </>
}

interface ITaskManagerLayoutProps{
    children: ReactNode
}

export const TaskManagerLayout = (props: ITaskManagerLayoutProps) => {
    const [ windows, setWindows ] = useState<IWindow[]>([])

    const options: ITaskManagerContext = {
        windows,

        open(content, options) {
            setWindows([ ...windows, {
                id: NewWindowID(),
                content, options                
            }])
        },

        close(id) {
            setWindows(windows.filter(window => window.id != id))
        },

        create(){
            return { id: NewWindowID() } as any
        },

        add(window){
            setWindows([ ...windows, window])
        }
    }

    return <>
        <TaskManagerContext.Provider value={options}>
            {props.children}
            <Tasks/>
            <Windows/>
        </TaskManagerContext.Provider>
    </>
}
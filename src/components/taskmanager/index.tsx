import { LeftSide, RightSide, SidedDiv } from "@components/gui/Bars"
import { Button } from "@components/gui/Button"
import { Buttons } from "@components/gui/Buttons"
import { createContext, MouseEventHandler, ReactNode, useContext, useRef, useState } from "react"
import { callback } from "src/utils"
import { EventEmitter } from "stream"
import styles from "./styles.module.scss"

let window_id = 0;
const NewWindowID = () => (window_id++)

interface IWindowOptions{
    x: number,
    y: number,
    h: number,
    w: number,
    title: string,
    onClose?: MouseEventHandler
}

interface IWindow{
    id: number,
    content: JSX.Element,
    options: IWindowOptions
}

interface ITaskManagerContext{
    windows: IWindow[],
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

const Window = (props: IWindowProps) => {
    const { close } = useWindows()
    const [ isDown, setIsDown ] = useState(false)
    const ref = useRef<HTMLElement | undefined>(undefined)

    const [ options, setOptions ] = useState(props.data.options)

    return <>
        <div 
            ref={ref as any}
            className={styles.window} 
            style={{ 
                left: options.x + 'px', 
                top: options.y + 'px',
                height: options.h + 'px',
                width: options.w + 'px',
            }}
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
                        const border = { top: 0, left: 0, bottom: window.innerHeight - options.h, right: window.innerWidth - options.w }
                        setOptions({
                            ...options,
                            ...MakePointInRect(pos, border)
                        })
                    }
                }}
            >
                <SidedDiv>
                    <LeftSide><span>{`[${props.data.id}]`}{options.title ?? 'WND'}</span></LeftSide>
                    <RightSide>
                        <Buttons>
                            <Button onClick={(event) => { 
                                close(props.data.id) 
                                props.data.options.onClose && props.data.options.onClose(event)
                            }}>x</Button>
                        </Buttons>
                    </RightSide>
                </SidedDiv>    
            </div> 
            <div className={styles.windowcontent}>
                {props.data.content}
            </div>
        </div>
    </>
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
    }

    return <>
        <TaskManagerContext.Provider value={options}>
            {props.children}
            <Tasks/>
            <Windows/>
        </TaskManagerContext.Provider>
    </>
}
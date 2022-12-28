import { useState, MouseEvent, useMemo, MouseEventHandler, useRef, RefObject } from "react";
import { SelectInput, TextInput, useInput, useNotify, SaveButton, Toolbar, useRecordContext } from 'react-admin';
import { RichTextInput, RichTextInputToolbar } from 'ra-input-rich-text';
import { useEditContext, useCreateContext, useUpdate, useCreate, useRedirect } from 'react-admin';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';
import { IPostData, IPostMeta } from "@components/template/types";
import { TemplateManager, GetTemplateSchema, GetTemplates } from "@components/template/TemplateManager";
import { GetKeyDefaultValue, MetaEditor, NormalizeMeta } from "@components/template/MetaEditor";
import { FileManagerToggleButton } from "@components/filemanager";
import { useGStorage } from "src/contexts/storage";
import { styles } from '..'
import { Button } from "@components/gui/Button";
import { AnyJSON_toBase64, cl } from "src/tools";
import dynamic from 'next/dynamic'
import { useWindows } from "@components/taskmanager";
import { GetTemplateMock } from "./mocks";
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

const getPostUrl = (data: string) => `http://192.168.0.238:3000/test/articles/${data}`

export function PostCategoryField(props: { source: string }){
	const record = useRecordContext<IPostData>();
	const { storage } = useGStorage()

	const cats = storage.content.categories
	const cat = cats ? cats.find((cat) => cat.id == record.category_id) : null
	const text = cat ? cat.title : 'No category'

	return <>
		<span>{text}</span>
	</>
}

function SaveButton_edit(props){
    const notify = useNotify()
    const [ update ] = useUpdate<IPostData, Error>();
    const { getValues } = useFormContext<IPostData>();
	const { resource } = useEditContext<IPostData>()
	const data = getValues()

	async function onClick(event: MouseEvent<any>){
        event.preventDefault();
		const id = data.id
		await update(resource!, {id, data}, {
			onSuccess: () => { 
				notify(`Post saved!`) 
			},
			onError: (error) => { 
				notify(`Error: ${error.message}`, { type: 'error' }) 
			}
		})
    }

    return <SaveButton title='Save post' {...props} onClick={onClick} type='button'/>
}

export function EditToolbar(){
    return <Toolbar>
        <SaveButton_edit/>
    </Toolbar>
}

function SaveButton_Create(props){
    const notify = useNotify()
    const [ create ] = useCreate<IPostData, Error>();
    const { getValues } = useFormContext<IPostData>();
	const { resource } = useCreateContext<IPostData>()
	const do_redirect = useRedirect()
	const data = getValues()

	async function onClick(event: MouseEvent<any>){
        event.preventDefault();
		const c = await create(resource!, {data}, {
			onSuccess: () => { 
				notify(`Post created!`) 
			},
			onError: (error) => { 
				console.log({ error }); 
				notify(`Error: ${error.message}`, { type: 'error' }) 
			},
			returnPromise: true
		})
		
		//console.log({resource, c})
		c && do_redirect(`/${resource}/${c.id}`)
    }

    return <SaveButton {...props} onClick={onClick} type='button'/>
}

export function CreateToolbar(){
    return <Toolbar>
        <SaveButton_Create/>
    </Toolbar>
}


const MetaField = (props: { source: string, field: ControllerRenderProps, meta: any, template: string }) => {
	return <TextInput
		type={''}
		source={props.source}
		field={props.field}
		disabled fullWidth
		format={value => { try { return JSON.stringify(value) } catch (error) { return '#ERROR' } }}
		parse={value => { try { return JSON.parse(value) } catch (error) { return '#ERROR' } }}
	/>
}

const choises_status = [
	{ id: 1, name: 'Publish', value: 'publish' },
	{ id: 2, name: 'Draft', value: 'draft' },
]

interface ITemplateEditor{
	post: IPostData,
	onChangeMeta(meta: IPostMeta): void
}

function TemplateEditor(props: ITemplateEditor){
	const { post, onChangeMeta } = props
	const { template, meta: _meta } = post

    const scheme = GetTemplateSchema(template)

    const meta = useMemo<IPostMeta>(() => {
		const key = { type: 'object', scheme }
		return _meta ? NormalizeMeta(_meta, key) : GetKeyDefaultValue(key)
	}, [template, _meta, scheme])

	const data: IPostData = {
		...post,
		template, 
		meta,
	}

	return <>
		{ Object.keys(scheme).length > 0 && <MetaEditor meta={meta} onChange={onChangeMeta} scheme={scheme} /> }
		<div className={styles.wrapper}>
			<TemplateManager data={data} />
		</div>
	</>
}

const onResresh = (ref: RefObject<HTMLIFrameElement>, post: IPostData) => {
	const { current } = ref
	const based = AnyJSON_toBase64(post)
	if(current){ current.src = getPostUrl(based) }
	return
}

type setPost_t = (post: IPostData) => void

const onCaptionChange = (value: string, post: IPostData, setPost: setPost_t, field: ControllerRenderProps) => {
	field.onChange(value)
	const { caption, ...other } = post 
	setPost({ caption: value, ...other })
}

const onImageChange = (value: string, post: IPostData, setPost: setPost_t, field: ControllerRenderProps) => {
	field.onChange(value)
	const { image_url, ...other } = post 
	setPost({ image_url: value, ...other })
}

const onTextChange = (value: string, post: IPostData, setPost: setPost_t, field: ControllerRenderProps) => {
	field.onChange(value)
	const { text, ...other } = post 
	setPost({ text: value, ...other })
}

function onMetaChange (value: any, post: IPostData, setPost: setPost_t, field: ControllerRenderProps){
	field.onChange(value)
	const { meta, ...other } = post
	console.log({ newmeta: value })
	setPost({ meta: value, ...other })
}

function onTemplateChange (value: string, post: IPostData, setPost: setPost_t, field: ControllerRenderProps){
	field.onChange(value)
	const { template, ...other } = post
	setPost({ template: value, ...other })
}

export function PostCommonEditor(props: { data: IPostData }) {
	const iframe = useRef<HTMLIFrameElement>(null)
	const [ post, setPost ] = useState(props.data)

	const { storage } = useGStorage()
	const cats = storage.content.categories
	const GetCategories = () => cats ? cats.map((item) => ({ id: item.id, name: item.title })) : []

	const choises_cat = GetCategories()
	const choises_templ = GetTemplates()
	
	function OnApplyTemplate(...events: any[]) {
		const event = events[0] as MouseEvent<any>
		const target = event.target as HTMLInputElement

		const { template, meta, ...other } = post
		const newtemplate = target.value
		const newmeta = GetTemplateMock(newtemplate)

		field_meta.onChange(newmeta)
		setPost({ 
			template: newtemplate, 
			meta: newmeta,
			...other })
	}

	const { field: field_meta } = useInput({ source: 'meta' })
	const { field: field_image } = useInput({ source: 'image_url' })
	const { field: field_caption } = useInput({ source: 'caption' })
	const { field: field_content } = useInput({ source: 'text' })
	
	return <>
		<div className={styles.line_1}>
			<TextInput 
				field={field_caption} className={styles.caption} source="caption" 
				onChange={(...e: any[]) => onCaptionChange(e[0].target.value, post, setPost, field_caption)}
			/>
		</div>
		<div className={styles.line_2}>
			<RichTextInput 
				field={field_content} 
				className={styles.text} 
				source="text" 
				toolbar={<RichTextInputToolbar  size="large" />} 
				onChange={(value: any) => onTextChange(value, post, setPost, field_content)}
			/>
		</div>
		<div className={styles.line_3}>
			<SelectInput source="category_id" choices={choises_cat} optionValue="id"/>

			<SelectInput source="template"
				choices={choises_templ}
				optionValue="name" 
				onChange={OnApplyTemplate} 
				defaultValue='post' 
				emptyValue='post'
				emptyText={'default (post)'} 
			/>

			<SelectInput source="status" choices={choises_status} optionValue="value" accessKey=""/>
			
			<TextInput 
				source="image_url" field={field_image}
				onChange={(...e: any[]) => onImageChange(e[0].target.value, post, setPost, field_image)}
			/>

			<FileManagerToggleButton className={styles.filemanager}/>

			<ToggleMetaEditorButton 
				className={styles.filemanager} data={post.meta} 
				onChange={(value) => onMetaChange(value, post, setPost, field_meta)} 
			/>

			<Button className={styles.refresh} onClick={() => onResresh(iframe, post)}>Refresh</Button>
		</div>
		<MetaField 
			source="meta" 
			field={field_meta} 
			meta={post.meta} 
			template={post.template}
		/>
		<iframe ref={iframe} style={{ width: '100%', minHeight: '1000px' }} />
	</>
}

interface IToggleMetaEditorButtonProps{
	data: any,
	onChange(newdata): void,
	className?: string
}

export const ToggleMetaEditorButton = (props: IToggleMetaEditorButtonProps) => { 
    const windows = useWindows()
    const [ isOpen, setOpened ] = useState(false);

    const onClick: MouseEventHandler = (event) => { 
        event.preventDefault()
        event.stopPropagation()

        if(!isOpen){
            setOpened(true)
			// here i can just change editor component
            windows.open(<ReactJson
				src={props.data}
				onAdd={p => props.onChange(p.updated_src)}
				onDelete={p => props.onChange(p.updated_src)}
				onEdit={p => props.onChange(p.updated_src)}
				displayObjectSize
				displayDataTypes
			/>, {
                title: 'Meta editor',
				style: {
					maxHeight: '70vh',
					maxWidth: '80vw',
					minHeight: '30vh',
					minWidth: '50vh',
				},
                onClose: () => setOpened(false)
            })
        }

        return
    }

    return <>
        <Button className={cl(styles.toggle_button, props.className)} onClick={onClick}>Meta editor</Button>
    </> 
}
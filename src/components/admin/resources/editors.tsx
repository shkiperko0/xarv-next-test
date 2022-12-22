import { useState, MouseEvent, useMemo, MouseEventHandler, useRef } from "react";
import { SelectInput, TextInput, useInput, useNotify, SaveButton, Toolbar, useRecordContext } from 'react-admin';
import { RichTextInput, RichTextInputToolbar } from 'ra-input-rich-text';
import { useEditContext, useCreateContext, useUpdate, useCreate, useRedirect } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { IPostData, IPostMeta } from "@components/template/types";
import { TemplateManager, GetTemplateSchema, GetTemplates } from "@components/template/TemplateManager";
import { GetKeyDefaultValue, MetaEditor, NormalizeMeta } from "@components/template/MetaEditor";
import { FileManagerToggleButton } from "@components/filemanager";
import { useGStorage } from "src/contexts/storage";
import { styles } from '..'
import { Button } from "@components/gui/Button";
import { AnyJSON_toBase64 } from "src/tools";
import statics from "src/statics";

const getPostUrl = (data: string) => `${statics.host.eam}/test/articles/${data}`

export function PostCategoryField(props: { source: string }){
	const record = useRecordContext<IPostData>();
	const { storage } = useGStorage()

	const cats = storage.content.categories
	const cat = cats.find((cat) => cat.id == record.category_id)
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
	const { id, ...data } = getValues()

	async function onClick(event: MouseEvent<any>){
        event.preventDefault();
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
	const { id, ...data } = getValues()

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


const MetaField = (props: { source: string, field: any, meta: any, template: string }) => {
	const scheme = GetTemplateSchema(props.template)
	return <><TextInput
		//style={{'display': 'none'}}
		type={''}
		source={props.source}
		{ ...props.field }
		disabled fullWidth
		format={value => { try { return JSON.stringify(value) } catch (error) { return '#ERROR' } }}
		parse={value => { try { return JSON.parse(value) } catch (error) { return '#ERROR' } }}
	/>
		<MetaEditor meta={ NormalizeMeta(props.meta, { type: 'object', scheme }) } scheme={scheme} onChange={() => {}}/>
	</>
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

export function PostCommonEditor(props: { data: IPostData }) {
	const iframe = useRef<HTMLIFrameElement>(null)
	const { storage } = useGStorage()
	const cats = storage.content.categories
	const GetCategories = () => cats.map((item) => ({ id: item.id, name: item.title }))

	const choises_cat = GetCategories()
	const choises_templ = GetTemplates()
	
	const { data: post } =  props
	const [ template, setTemplate ] = useState(post.template)
	const record = useRecordContext<IPostData>();
	const meta = useMemo(() => ((record ? record.meta : post.meta) ?? {}), [record, post.meta])

	const data: IPostData = {
		...post,
		template,
		meta,
	}
	
	function OnApplyTemplate(...events: any[]) {
		const event = events[0] as MouseEvent<any>
		const target = event.target as HTMLInputElement
		setTemplate(target.value)
	}

	function OnApplyMeta(meta: IPostMeta){
		//setMeta(meta)
		field.onChange(meta)
	}

	const onResresh: MouseEventHandler = () => {
		const { current } = iframe
		if(current){
			current.src = getPostUrl(AnyJSON_toBase64(data))
		}
		return
	}


	const { field: { name, onBlur, onChange, value } } = useInput({ source: 'meta' })
	const field = { name, onBlur, onChange, value }
	
	return <>
		<div className={styles.line_1}>
			<TextInput className={styles.caption} source="caption" />
		</div>
		<div className={styles.line_2}>
			<RichTextInput className={styles.text} source="text" toolbar={<RichTextInputToolbar  size="large" />} />
		</div>
		<div className={styles.line_3}>
			<SelectInput source="category_id" choices={choises_cat} optionValue="id"  />
			<SelectInput source="template"
				choices={choises_templ}
				optionValue="name" 
				onChange={OnApplyTemplate} 
				defaultValue='post' 
				emptyValue='post'
				emptyText={'default (post)'} 
			/>
			<SelectInput source="status" choices={choises_status} optionValue="value" accessKey=""/>
			<TextInput source="image_url" />
			<FileManagerToggleButton className={styles.filemanager}/>
			<Button className={styles.refresh} onClick={onResresh}>Refresh</Button>
		</div>
		<MetaField source="meta" field={field} meta={data.meta} template={data.template}/>
		<TemplateEditor onChangeMeta={OnApplyMeta} post={data} />
		<iframe ref={iframe} style={{ width: '100%', minHeight: '1000px' }} />
	</>
}

export function PostPageEditor(props: { data: IPostData }) {
	const iframe = useRef<HTMLIFrameElement>(null)
	
	const choises_templ = GetTemplates()
	
	const { data: post } =  props
	const [ template, setTemplate ] = useState(post.template)
	const [ meta = {}, setMeta ] = useState(post.meta)
	const data: IPostData = {
		...post,
		template,
		meta,
	}
	
	function OnApplyTemplate(...events: any[]) {
		const event = events[0] as MouseEvent<any>
		const target = event.target as HTMLInputElement
		setTemplate(target.value)
	}

	function OnApplyMeta(meta: IPostMeta){
		setMeta(meta)
		field.onChange(meta)
	}

	const onResresh: MouseEventHandler = () => {
		const { current } = iframe
		if(current){
			current.src = getPostUrl(AnyJSON_toBase64(data))
		}
	}

	const { field: { name, onBlur, onChange, value } } = useInput({ source: 'meta' })
	const field = { name, onBlur, onChange, value }

	return <>
		<div className={styles.line_1}>
			<TextInput className={styles.caption} source="caption" />
		</div>
		<div className={styles.line_2}>
			<RichTextInput className={styles.text} source="text" toolbar={<RichTextInputToolbar  size="large" />} />
		</div>
		<div className={styles.line_3}> 
			<SelectInput source="template"
				choices={choises_templ}
				optionValue="name" 
				onChange={OnApplyTemplate} 
				defaultValue='post' 
				emptyValue='post'
				emptyText={'default (post)'} 
			/>
			<SelectInput source="status" choices={choises_status} optionValue="value" accessKey=""/>
			<TextInput source="image_url" />
			<FileManagerToggleButton className={styles.filemanager}/>
			<Button className={styles.refresh} onClick={onResresh}>Refresh</Button>
		</div>
		<MetaField source="meta" field={field} meta={data.meta} template={data.template}/>
		<TemplateEditor onChangeMeta={OnApplyMeta} post={data} />
		<iframe ref={iframe} style={{ width: '100%', minHeight: '1000px' }} />
	</>
}

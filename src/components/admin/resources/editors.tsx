import { useState, MouseEvent, useMemo } from "react";
import { SelectInput, TextInput, useInput, useNotify, SaveButton, Toolbar, useRecordContext } from 'react-admin';
import { RichTextInput, RichTextInputToolbar } from 'ra-input-rich-text';
import styles from 'src/components/admin/styles.module.scss'
import { useEditContext, useCreateContext, useUpdate, useCreate, useRedirect } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { IPostData, IPostMeta } from "@components/template/types";
import { TemplateManager, GetTemplateSchema, GetTemplates } from "@components/template/TemplateManager";
import { GetKeyDefaultValue, MetaEditor, NormalizeMeta } from "@components/template/MetaEditor";
import { FileManager } from "@components/filemanager";
import { useGStorage } from "src/contexts/storage";

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


const MetaField = (props: { source: string, field: any }) => {
	return <TextInput
		style={{'display': 'none'}}
		type={''}
		source={props.source}
		{ ...props.field }
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

export function PostCommonEditor(props: { data: IPostData }) {
	const { storage } = useGStorage()
	const cats = storage.content.categories
	const GetCategories = () => cats.map((item) => ({ id: item.id, name: item.title }))

	const choises_cat = GetCategories()
	const choises_templ = GetTemplates()
	
	const { data: post } =  props
	const [ template, setTemplate ] = useState(post.template)
	const record = useRecordContext<IPostData>();
	const meta = useMemo(() => ((record ? record.meta : post.meta) ?? {}), [record.meta, post.meta])

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

	const { field: { name, onBlur, onChange, value } } = useInput({ source: 'meta' })
	const field = { name, onBlur, onChange, value }
	
	return <>
		<FileManager/>
		<TextInput source="caption" />
		<SelectInput source="status" choices={choises_status} optionValue="value" accessKey=""/>
		<SelectInput source="category_id" choices={choises_cat} optionValue="id"  />
		<TextInput source="image_url" />
		<RichTextInput source="text" toolbar={<RichTextInputToolbar size="large" />} />
		<SelectInput source="template"
			choices={choises_templ}
			optionValue="name" 
			onChange={OnApplyTemplate} 
			defaultValue='post' 
			emptyValue='post'
			emptyText={'default (post)'} 
		/>
		<MetaField source="meta" field={field}/>
		<TemplateEditor onChangeMeta={OnApplyMeta} post={post} />
	</>
}

export function PostPageEditor(props: { data: IPostData }) {
	
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

	const { field: { name, onBlur, onChange, value } } = useInput({ source: 'meta' })
	const field = { name, onBlur, onChange, value }

	return <>
		<FileManager/>
		<TextInput source="caption" />
		<SelectInput source="status" choices={choises_status} optionValue="value" />
		<TextInput source="image_url" />
		<RichTextInput source="text" toolbar={<RichTextInputToolbar size="large" />} />
		<SelectInput source="template"
			choices={choises_templ}
			optionValue="name" 
			onChange={OnApplyTemplate} 
			defaultValue='post' 
			emptyValue='post'
			emptyText={'default (post)'} 
		/>
		<MetaField source="meta" field={field}/>
		<TemplateEditor onChangeMeta={OnApplyMeta} post={data} />
	</>
}

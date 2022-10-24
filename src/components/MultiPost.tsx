import { useEffect, useState } from "react"
import statics from "src/statics"
import TemplateManager, { IPostProps } from "./TemplateManager"

async function fetchPosts(post_ids: number[], cb: (_: any) => void ): Promise<IPostProps[]> {
    const posts: IPostProps[] = []

    console.log('get posts', post_ids)

    for(const id of post_ids){
        const response = await fetch(`${statics.host.api}/posts/${id}`)
        posts.push(await response.json())
    }

    cb(posts)

    return posts
}

export default function MultiPost(props: IPostProps){
    const [ posts, setPosts ] = useState<IPostProps[] | null>(null)

    console.log(props)

    useEffect(() => {
        // if(posts) return
        fetchPosts(props.meta.posts, setPosts)
    }, [props.meta.posts])

    return posts 
    ? <>
        { posts.map(props => <TemplateManager key={props.id} props={props} template={props.template}/>) }
    </> 
    
    : <>
        Loading
    </>
}
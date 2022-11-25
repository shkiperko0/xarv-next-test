import { useState } from "react"

import styles from './Posts.module.scss'


interface IPostData{
    id: number,
    caption: string,
    text: string,
}

interface IPostPreviewProps{
    postsPerPage?: number,
    posts?: IPostData[],

}

const lorem = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, doloribus cum. Eum debitis, commodi provident soluta aliquam iusto maiores sed dolorum, repellat dignissimos magni culpa vero nobis aspernatur necessitatibus fugiat!`

const mock_posts: IPostData[] = [

    {
        id: 1,
        caption: 'First post',
        text: lorem
    },

    {
        id: 2,
        caption: 'Second post',
        text: lorem
    },

    {
        id: 3,
        caption: 'Third post',
        text: lorem
    },

    {
        id: 4,
        caption: 'Fourt post',
        text: lorem
    },

    {
        id: 5,
        caption: '5 post',
        text: lorem
    },

    {
        id: 6,
        caption: '6 post',
        text: lorem
    },

    {
        id: 7,
        caption: '7 post',
        text: lorem
    },

    {
        id: 8,
        caption: '8 post',
        text: lorem
    },

    {
        id: 9,
        caption: '9 post',
        text: lorem
    },

    {
        id: 10,
        caption: '10 post',
        text: lorem
    },

    {
        id: 11,
        caption: '11 post',
        text: lorem
    }

]

interface IPostProps{
    id: number,
    caption: string,
    text: string,
}

export function PostPreview(props: IPostProps){
    const { caption, id, text } = props
    return <div className={styles.post}>
        <a href={`/posts/${id}`}>
            <div className={styles.header}>
                <span className={styles.caption}>{caption}</span>
            </div>
        </a>
        <div className={styles.content}>{text}</div>
        <div className={styles.footer}></div>
    </div>
}

export function FullPost(props: IPostProps){
    const { caption, id, text } = props
    return <div className={styles.post}>
        <a href={`/posts/${id}`}>
            <div className={styles.header}>
                <span className={styles.caption}>{caption}</span>
            </div>
        </a>
        <div className={styles.content} dangerouslySetInnerHTML={{__html: text}}/>
        <div className={styles.footer}></div>
    </div>
}

export default function PostsPreviews(props: IPostPreviewProps){
    const { postsPerPage = mock_posts.length, posts = mock_posts } = props

    const [ page, setPage ] = useState(0)


    return <div className={styles.posts}>
        { posts.map(post => <PostPreview key={post.id} {...post}/>)}
    </div>
}
import {BloggerType, PostType} from "./types";

export const posts: PostType[] = [
    {id: 1, title: 'POST 1', shortDescription: 'no description', content: 'it first post', bloggerId: 1, bloggerName: 'GARRY'},
    {id: 2, title: 'POST 2', shortDescription: 'no description', content: 'it second post', bloggerId: 2, bloggerName: 'PETER'},
    {id: 3, title: 'POST 3', shortDescription: 'no description', content: 'it third post', bloggerId: 3, bloggerName: 'MARY'}
]

export let bloggers: BloggerType[] = [
    {id: 1, name: 'GARRY', youtubeUrl: 'https://youtube.com'},
    {id: 2, name: 'PETER', youtubeUrl: 'https://youtube.com'},
    {id: 3, name: 'MARY', youtubeUrl: 'https://youtube.com'},
]

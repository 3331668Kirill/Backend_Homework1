import 'dotenv/config'
const {MongoClient} = require('mongodb');

export const getPaginationData = (query: any) => {
    const page = typeof query.PageNumber === 'string' ? +query.PageNumber : 1
    const pageSize = typeof query.PageSize === 'string' ? +query.PageSize : 10
    const searchNameTerm = typeof query.SearchNameTerm === 'string' ? query.SearchNameTerm : ""
    return {page, pageSize, searchNameTerm}
}

export type PostType = {
    id?: string;
    title: string | null;
    shortDescription: string | null;
    content: string | null;
    bloggerId: string;
    bloggerName?: string | null;
}
export type BloggerType = {
    id: string;
    name: string | null;
    youtubeUrl: string | null;
}
export type UserType = {
    id?: string;
    login: string;
    passwordHash?: string;
    passwordSalt?: string;
}
export type CommentType = {
    id: string;
    content: string; //20<len<300
    postId: string;
    userId: string;
    userLogin: string;
    addedAt: Date;
}

export type PostWithPaginationType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostType[];
}
export type EntityWithPaginationType<T> = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
}

export type QueryDataType = {
    page: number;
    pageSize: number;
    searchNameTerm: string;
}

        const mongoUri = process.env.mongoURI
export const client = new MongoClient(mongoUri)
export const bloggersCollection = client.db("bloggersDB").collection("bloggers")
export const postsCollection = client.db("bloggersDB").collection("posts")
export const requestCollection = client.db("bloggersDB").collection("requests")
export const usersCollection = client.db("bloggersDB").collection("users")
export const commentsCollection = client.db("bloggersDB").collection("comments")

export async function runDb() {
    try {
        await client.connect()
        await client.db("bloggersDB").command({ping: 1})
        console.log("Connection complete")
    } catch (e) {
        await client.close()
        console.log("no connection")
    }
}

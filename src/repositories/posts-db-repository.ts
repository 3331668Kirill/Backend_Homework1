import {bloggersCollection, postsCollection, PostType} from "./db";
import {BloggersRepository, bloggersRepository} from "./bloggers-db-repository";

export class PostsRepository  {
    constructor(private postsCollection: any,//те же вопросы что для блогеров
                private bloggersCollection: any,
                private bloggersRepository: BloggersRepository) {}
    async getPosts(page: number, pageSize: number, searchNameTerm: string, bloggerId: string | null) {
        let allPosts: PostType[] = []
        let filter = bloggerId
            ?{title : {$regex : searchNameTerm ? searchNameTerm : ""}, bloggerId}
            :{title : {$regex : searchNameTerm ? searchNameTerm : ""}}
        const totalCount = await this.postsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        allPosts = await this.postsCollection
            .find(filter)
            .project({_id: 0})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        return ({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: allPosts
        })
    }
    async getPostById(id: string) {
        const post = await this.postsCollection.findOne({id})
        if (!post) return false
        const blogger = await this.bloggersRepository.getBloggerById(post.bloggerId)
        if (!blogger) return false
        const bloggerName = blogger.name
        delete post._id
        return ({
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            bloggerId: post.bloggerId,
            bloggerName
        })
    }
    async createPost(newPost: PostType): Promise<PostType | boolean> {
        const blogger = await this.bloggersCollection.findOne({id: newPost.bloggerId})
        if(!blogger) return false
        await postsCollection.insertOne({
            ...newPost,
            bloggerName: blogger.name
        })
        const postToReturn = await this.postsCollection.findOne({id: newPost.id})
        delete postToReturn._id
        return (postToReturn)
    }
    async updatePostById(newPost: PostType) {
        const id = newPost.id
        const result = await this.postsCollection.updateOne({id}, {
            $set: {
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                bloggerId: newPost.bloggerId
            }
        })
        return result.modifiedCount === 1
    }
    async deletePostById(id: string) {
        const result = await this.postsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}
export const postsRepository = new PostsRepository(postsCollection, bloggersCollection, bloggersRepository)


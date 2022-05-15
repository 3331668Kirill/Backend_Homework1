import {PostsRepository, postsRepository} from "../repositories/posts-db-repository";
import {PostType} from "../repositories/db";
import {v4 as uuidv4} from "uuid";

export class PostsService {
    constructor(private postsRepository: PostsRepository) {
    }
    async getPosts(page: number, pageSize: number, searchNameTerm: string, bloggerId: string | null) {
        const postsToSend = await this.postsRepository.getPosts(page, pageSize, searchNameTerm, bloggerId)
        return postsToSend
    }
    async getPostById(id: number): Promise<PostType | false> {
        const post = await this.postsRepository.getPostById(id)
        if (post) {
            return post
        } else return false
    }
    async createPost(newPostData: PostType): Promise<PostType | boolean> {
        const postToCreate = {
            ...newPostData,
            //id: uuidv4(),
            id: +(new Date()),
        }
        return await this.postsRepository.createPost(postToCreate)

    }
    async updatePostById(id: number, newPost: PostType) {
        return await this.postsRepository.updatePostById({
            id,
            ...newPost
        })
    }
    async deletePostById(id: number): Promise<boolean> {
        return await this.postsRepository.deletePostById(id)
    }
}
export const postsService = new PostsService(postsRepository)


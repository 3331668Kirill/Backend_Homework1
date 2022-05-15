import {bloggersCollection, BloggerType, postsCollection} from "./db";


export class BloggersRepository  {
    constructor(private bloggersCollection: any, private postsCollection: any ) {//Как типизировать?Тип передавать в конструктор?
    }                                                                            // Что делает private?
    async getBloggers(page: number, pageSize: number, searchNameTerm: string) {
        const filter = {name : {$regex : searchNameTerm ? searchNameTerm : ""}}
        const bloggers = await this.bloggersCollection
            .find(filter)
            .project({_id: 0})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        const totalCount = await this.bloggersCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return ({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: bloggers
        })
    }
    async getBloggerById(bloggerId: string): Promise<BloggerType | false> {
        const blogger = await this.bloggersCollection.findOne({id: bloggerId})
        if (blogger) {
            delete blogger._id
            return blogger
        }else return false
    }
    async createBlogger(newBlogger: BloggerType) {
        await this.bloggersCollection.insertOne(newBlogger)
        return {
            id: newBlogger.id,
            name: newBlogger.name,
            youtubeUrl: newBlogger.youtubeUrl
        }
    }
    async updateBloggerById(id: string, name: string, youtubeUrl: string) {
        const result = await this.bloggersCollection.updateOne({id},
            {
                $set: {
                    "name": name,
                    "youtubeUrl": youtubeUrl
                }
            })
        await this.postsCollection.updateMany( {bloggerId: id},
            {$set: {
                    "bloggerName": name
                }}
        )
        return result.modifiedCount === 1
    }
    async deleteBloggerById(id: string): Promise<boolean> {
        const result = await this.bloggersCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}
export const bloggersRepository = new BloggersRepository(bloggersCollection, postsCollection)



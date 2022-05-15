import {commentsCollection, CommentType, QueryDataType} from "./db";

export const commentsRepository = {
    async getComments(paginationData: QueryDataType, postId: string | null) {

        let filter = postId
            ?{content : {$regex : paginationData.searchNameTerm ? paginationData.searchNameTerm : ""}, postId }
            :{content : {$regex : paginationData.searchNameTerm ? paginationData.searchNameTerm : ""}}
        const comments = await commentsCollection
            .find(filter)
            .project({_id:0, postId: 0})
            .skip((paginationData.page - 1) * paginationData.pageSize)
            .limit(paginationData.pageSize)
            .toArray()
        const totalCount = await commentsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / paginationData.pageSize)
        return ({
            pagesCount,
            page: paginationData.page,
            pageSize: paginationData.pageSize,
            totalCount,
            items: comments
        })
    },
    async createComment(newComment: CommentType) {
        await commentsCollection.insertOne(newComment)
        const createdComment = await commentsCollection.findOne({id: newComment.id})
        delete createdComment._id
        delete createdComment.postId
        return createdComment
    },
    async deleteComment(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id})
        return result.deletedCount === 1
    },
    async updateComment(id: string, content: string): Promise<boolean> {
        const result = await commentsCollection.updateOne({id}, {$set:{content: content}})
        return result.matchedCount === 1
    },
    async getCommentById(commentId: string) {
        const comment = await commentsCollection.findOne({id: commentId}, {_id:false})
        if (!comment) return null
        delete comment._id
        delete comment.postId
        return comment
    }
}

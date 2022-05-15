import {Request, Response, Router} from 'express'
import {
    commentValidationRules,
    inputValidatorMiddleware,
    paginationRules,
    postValidationRules
} from "../middlewares/input-validator";
import {postsService} from "../services/posts-service";
import {bloggersService} from "../services/bloggers-service";
import {getPaginationData, PostWithPaginationType} from "../repositories/db";
import {baseAuthMiddleware, checkHeaders} from "../middlewares/base-authmiddleware";
import {commentsService} from "../services/comment-service";
import {authMiddleware} from "../middlewares/auth-middleware";
export const postsRouter = Router()

postsRouter

    .get('/',
        paginationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const {page, pageSize, searchNameTerm} = getPaginationData(req.query)
            const posts: PostWithPaginationType = await postsService
                .getPosts(page, pageSize, searchNameTerm, null)
            res.status(200).send(posts)
        })

    .post('/',
        checkHeaders,
        postValidationRules,
        inputValidatorMiddleware,
        baseAuthMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId: string = req.body.bloggerId
            const blogger = await bloggersService.getBloggerById(bloggerId)
            if (!blogger) {
                res.status(400).send({
                    "errorsMessages": [
                        {
                            message: "blogger not found",
                            field: "bloggerId"
                        }
                    ],
                    "resultCode": 1
                })
            } else {
                const newPost = await postsService.createPost({
                    title: req.body.title,
                    shortDescription: req.body.shortDescription,
                    content: req.body.content,
                    bloggerId,
                })
                res.status(201).send(newPost)
            }
        })

    .get('/:postId',
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const postId = req.params.postId
            const returnedPost = await postsService.getPostById(postId)
            if (returnedPost) {
                res.send(returnedPost)
            } else {
                res.status(404).send({
                    "errorsMessages": [{
                        message: "post not found",
                        field: "id"
                    }],
                    "resultCode": 1
                })
            }
        })

    .put('/:postId',
        postValidationRules,
        checkHeaders,
        inputValidatorMiddleware,
        baseAuthMiddleware,
        async (req: Request, res: Response) => {
            const id = req.params.postId
            const updatePost = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                bloggerId: ""+req.body.bloggerId
            }
            const bloggerToUpdate = await bloggersService.getBloggerById(updatePost.bloggerId)
            if (!bloggerToUpdate) {
                res.status(400).send({
                    "errorsMessages": [{
                        message: "blogger not found",
                        field: "bloggerId"
                    }],
                    "resultCode": 1
                })
                return
            }
            const updatedPost = await postsService.updatePostById(id, updatePost)
            if (!updatedPost) {
                res.status(404)
                res.send({
                    "errorsMessages": [{
                        message: "post not found",
                        field: "id"
                    }],
                    "resultCode": 0
                })
            } else {
                res.status(204).send(updatedPost)
            }
        })

    .delete('/:postId',
        checkHeaders,
        baseAuthMiddleware,
        async (req: Request, res: Response) => {
            const id = req.params.postId
            const isDeleted = await postsService.deletePostById(id)
            if (isDeleted) {
                res.sendStatus(204)
            } else {
                res.status(404).send({
                    "errorsMessages": [{
                        message: "post not found",
                        field: "id"
                    }],
                    "resultCode": 1
                })
            }
        })
    .get('/:postId/comments',
        paginationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const id = req.params.postId
            const paginationData = getPaginationData(req.query)
            const comments: PostWithPaginationType = await commentsService
                .getComments(paginationData, id)
            if(comments.items.length <1) return res.sendStatus(404)
            const post = await postsService.getPostById(id)
            if(!post) return res.sendStatus(404)
            res.status(200).send(comments)
        })
    .post('/:postId/comments',
        authMiddleware,
        commentValidationRules,
        inputValidatorMiddleware,
        async (req:Request | any, res: Response) => {
            const postId = req.params.postId
            const paginationData = getPaginationData(req.query)
            //const userLogin = res.locals.userData.login
            const userLogin = req.user!.login
            const userId = req.user!.id
            const content = req.body.content
            const post  = await postsService.getPostById(postId)
            if(!post) return res.sendStatus(404)
            const comments: PostWithPaginationType = await commentsService
                .createComment(paginationData, content, postId, userLogin, userId!)
            res.status(201).send(comments)
        })

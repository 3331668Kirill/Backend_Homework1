import {Request, Response, Router} from 'express'
import {
    bloggerValidationRules,
    inputValidatorMiddleware,
    paginationRules,
    postValidationRules
} from "../middlewares/input-validator";
import {bloggersService} from "../services/bloggers-service";
import {getPaginationData} from "../repositories/db";
import {postsService} from "../services/posts-service";
import {baseAuthMiddleware, checkHeaders} from "../middlewares/base-authmiddleware";

export const bloggersRouter = Router()

bloggersRouter

    .get('/',
        paginationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const {page, pageSize, searchNameTerm} = getPaginationData(req.query)
            let bloggers = await bloggersService.getBloggers(page, pageSize, searchNameTerm)
            res.status(200).send(bloggers)
        })

    .post('/',
        checkHeaders,
        bloggerValidationRules,
        inputValidatorMiddleware,
        baseAuthMiddleware,
        async (req: Request, res: Response) => {
            let newBlogger = await bloggersService.createBlogger(
                req.body.name,
                req.body.youtubeUrl
            )
            res.status(201).send(newBlogger)
        })

    .post('/:bloggerId/posts',
        checkHeaders,
        postValidationRules,
        baseAuthMiddleware,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId = req.params.bloggerId
            let newPost = await postsService.createPost({
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                bloggerId,
            })
            if (!newPost) {
                res.sendStatus(404)
                return
            }
            res.status(201).send(newPost)
        })

    .get('/:bloggerId',
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId = +req.params.bloggerId
            const blogger = await bloggersService.getBloggerById(bloggerId)
            if (blogger) {
                res.status(200).send(blogger)
            } else {
                res.status(404)
                res.send({
                    "errorsMessages": [{
                        message: "blogger not found",
                        field: "id"
                    }],
                    "resultCode": 1
                })
            }
        })

    .get('/:bloggerId/posts',
        paginationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const {page, pageSize, searchNameTerm} = getPaginationData(req.query)
            const bloggerId = +req.params.bloggerId
            const blogger = await bloggersService.getBloggerById(bloggerId)
            if (blogger) {
                const posts = await postsService.getPosts(page, pageSize, searchNameTerm, bloggerId)
                res.status(200).send(posts)
            } else {
                res.status(404).send({
                    "errorsMessages": [{
                        message: "posts not found",
                        field: "bloggerId"
                    }],
                    "resultCode": 1
                })
            }
        })

    .put('/:bloggerId',
        checkHeaders,
        baseAuthMiddleware,
        bloggerValidationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId: number = +req.params.bloggerId
            const blogger = await bloggersService.updateBloggerById(
                bloggerId,
                req.body.name,
                req.body.youtubeUrl)
            if (!blogger) {
                res.status(404)
                res.send({
                    "errorsMessages": [{
                        message: "blogger not found",
                        field: "id"
                    }],
                    "resultCode": 0
                })
            } else {
                res.send(204)
            }
        })

    .delete('/:bloggerId',
        checkHeaders,
        baseAuthMiddleware,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId = +req.params.bloggerId
            const isDeleted = await bloggersService.deleteBloggerById(bloggerId)
            if (isDeleted) {
                res.send(204)
            } else {
                res.status(404)
                res.send({
                    "errorsMessages": [{
                        message: "blogger not found",
                        field: "id"
                    }],
                    "resultCode": 0
                })
            }
        })

import {Request, Response, Router} from 'express'
import {
    commentValidationRules,
    inputValidatorMiddleware
} from "../middlewares/input-validator";
import {check} from "express-validator";
import {authMiddleware} from "../middlewares/auth-middleware";
import {commentsService} from "../services/comment-service";
import {checkOwnership} from "../middlewares/check-ownership-middleware";

export const commentsRouter = Router()

commentsRouter
   .get('/:commentId',
        async (req: Request, res: Response) => {
            const commentId = req.params.commentId
            const comment = await commentsService.getCommentById(commentId)
            if(comment){
                res.send(comment)
            }else{
                res.sendStatus(404)
            }

        })


    .put('/:commentId',
        authMiddleware,
        checkOwnership,
        commentValidationRules,
        inputValidatorMiddleware,
        check('commentId').isString().withMessage('id should be string'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const commentId = req.params.commentId
            const content = req.body.content
            const updated = await commentsService.updateCommentById(commentId, content)

            if(updated){
                res.sendStatus(204)
            }else{
                res.sendStatus(404)
            }
        })

    .delete('/:commentId',
        authMiddleware,
        checkOwnership,
        //check('commentId').isInt({min: 1}).withMessage('id should be positive integer value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const commentId = req.params.commentId

            const result = await commentsService.deleteComment(commentId)
            if(result){
                res.sendStatus(204)
            }else{
                res.sendStatus(404)
            }
        })

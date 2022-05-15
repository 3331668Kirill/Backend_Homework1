import {Request, Response, Router} from 'express'
import {
    inputValidatorMiddleware,
    paginationRules,
    userValidationRules
} from "../middlewares/input-validator";

import {getPaginationData} from "../repositories/db";
import {usersService} from "../services/users-service";
import {baseAuthMiddleware, checkHeaders} from "../middlewares/base-authmiddleware";

export const usersRouter = Router()

usersRouter

    .get('/',
        paginationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const {page, pageSize, searchNameTerm} = getPaginationData(req.query)
            const users = await usersService.getUsers(page, pageSize, searchNameTerm)
            res.status(200).send(users)
        })

    .post('/',
        checkHeaders,
        //baseAuthMiddleware,
        userValidationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const createdUser = await usersService.createUser(
                req.body.login,
                req.body.password
            )
            res.status(201).send(createdUser)
        })

    .delete('/:userId',
        checkHeaders,
        baseAuthMiddleware,
        async (req: Request, res: Response) => {
            const userId = req.params.userId
            const isDeleted = await usersService.deleteUserById(userId)
            if (isDeleted) {
                res.send(204)
            } else {
                res.status(404)
                res.send({
                    "data": {},
                    "errorsMessages": [{
                        message: "blogger not found",
                        field: "id"
                    }],
                    "resultCode": 0
                })
            }
        })

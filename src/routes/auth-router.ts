import {Request, Response, Router} from 'express'
import {authService} from "../services/auth-service";


export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const checkResult = await authService.checkCredentials(req.body.login, req.body.password)
        if (checkResult.resultCode === 0) {
            res.status(200).send(checkResult.data)
        } else {
            res.sendStatus(401)
        }
    })

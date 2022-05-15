import {NextFunction, Request, Response} from "express";
import {requestCollection} from "../repositories/db";
import {format} from 'date-fns'

export const requestsSaverMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const newRequest = {
        "date": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        "method": req.method,
        "baseUrl": req.baseUrl,
        "body": req.body,
        "params": req.params,
        "url": req.url,
        "authorization": req.headers.authorization
    }
    console.table(newRequest)
    await requestCollection.insertOne(newRequest)
    next()
}

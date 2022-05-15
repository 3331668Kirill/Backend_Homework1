import {UserType} from "../repositories/db";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserType | null
            login: string
        }
    }
}

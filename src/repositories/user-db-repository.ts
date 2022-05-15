import {usersCollection, UserType} from "./db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async getUsers(page: number, pageSize: number, searchNameTerm: string) {
        const filter = {login : {$regex : searchNameTerm ? searchNameTerm : ""}}
        const users = await usersCollection
            .find(filter)
            .project({_id:0, passwordHash: 0})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await usersCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return ({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: users
        })
    },
    async createUser(newUser: UserType) {
        await usersCollection.insertOne(newUser)
        const createdUser = await usersCollection.findOne({id: newUser.id})
        return {
            id: createdUser.id,
            login: createdUser.login,
        }
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    findUserById(id: ObjectId) {
        const user = usersCollection.findOne({id})
        return user
    },
    findUserByLogin(login: string) {
        const user = usersCollection.findOne({login})
        return user
    }
}

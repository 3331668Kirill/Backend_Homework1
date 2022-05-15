import {UserType} from "../repositories/db";
import {usersRepository} from "../repositories/user-db-repository";
import {authService} from "./auth-service";
import {v4 as uuidv4} from "uuid";

export const usersService = {

    async getUsers(page: number, pageSize: number, searchNameTerm: string) {
        const users = await usersRepository.getUsers(page, pageSize, searchNameTerm)
        return users
    },
    async createUser(login: string, password: string): Promise<UserType> {
        const passwordHash = await authService._generateHash(password)
        const newUser = {
            id: uuidv4(),
            login,
            passwordHash,
        }
        const createdUser = await usersRepository.createUser(newUser)
        return createdUser
    },
    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },

}


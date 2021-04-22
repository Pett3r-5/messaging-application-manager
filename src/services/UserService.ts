import { UserEntity, UserDocument } from '../schemas/UserSchema'
import UserModel from '../models/User'
import mongoose, { Schema } from 'mongoose'
import UserRepository from '../repositories/UserRepository'

export default class MessageService {
    public userRepository:UserRepository

    constructor(userRepository:UserRepository){
        this.userRepository = userRepository
    }

    public findOrCreateUser = async (user:UserModel)=>  {
        const userInDB = await this.userRepository.getUserByClientId(user.clientId)
        if(!userInDB) {
            await this.userRepository.create(user)
            return user;
        }
        return userInDB
    }

    public updateName = (user:UserModel)=>  this.userRepository.updateName(user)
}
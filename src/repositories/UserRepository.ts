import { UserEntity, UserDocument } from '../schemas/UserSchema'
import UserModel from '../models/User'
import mongoose from 'mongoose'

export default class MessageRepository {
    constructor(){}

    public getUserByClientId = (id:string)=> UserEntity.findOne({clientId: id})
    public create = (user:UserModel)=> UserEntity.create({clientId: user.clientId, name: user.name, isOnline: true})
    public updateName = (user:UserModel)=> (UserEntity.findOneAndUpdate(
        {clientId: user.clientId},
        {$set: {name: user.name}},
        {new: true, useFindAndModify: false}))
}
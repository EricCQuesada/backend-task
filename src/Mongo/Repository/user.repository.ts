import { Injectable } from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { Model, Connection, ObjectId } from 'mongoose';
import { User } from "../Interfaces/user.interface";
import { UserDTO } from "src/DTO/user.dto";

@Injectable()
export class UserRepository {

    constructor(
        @InjectModel('users') private readonly userModel: Model<User>
    ){}

    async getAllUsers() : Promise<User[]>{
        return await this.userModel.find({}, { __v: false }).sort({ name : + 1}).exec();
    }

    async saveUser(newUser : UserDTO): Promise<User>{
        const createdUser = new this.userModel(newUser);
        return createdUser.save();
    }

    async findById(userID: string): Promise<User>{
        return await this.userModel.findById(userID, { __v : false});
    }

    async deleteUser(userID: string): Promise<User>{
        return await this.userModel.findOneAndDelete({ ObjectId : userID});
    }

    async updateUser(userID: string, user: UserDTO): Promise<User>  {
        return await this.userModel.replaceOne({ ObjectId: userID}, user);
    }

    async findByAvatar(userName: string): Promise<User[]> { 
        return await this.userModel.find({ name : { '$regex' : userName, '$options' : 'i' } }, { __v : false});
    }

}
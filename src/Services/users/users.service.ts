import { ObjectId } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { UserDTO } from 'src/DTO/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/Mongo/Interfaces/user.interface';
import { UserRepository } from 'src/Mongo/Repository/user.repository';
import { HttpService } from '@nestjs/axios';
import { map, tap } from 'rxjs';

@Injectable()
export class UsersService {

    constructor(
        private readonly userRepository : UserRepository,
        private readonly httpService: HttpService
    ){}

    async getAllUsers(): Promise<User[]> {
        const allUsers = await this.userRepository.getAllUsers();
        
        if(!allUsers.length)
            throw new BadRequestException('There are no users registered yet');
        else
            return allUsers;

    }

    async getUserByIdMongo(userID: string) : Promise<User> {
        
        try{
            return await this.userRepository.findById(userID);
        } catch(e){
            throw new BadRequestException('This user does not exist');
        }

    }

    async getUserByIdExterno(userID: string) : Promise<User> {

        let users = []
    
        const url = `https://reqres.in/api/users/${userID}`;
        const { status, data } = await this.httpService.get(url).toPromise();
        if (status === 200) {
          return users = data;
        }
    }

    async getAvatarByLink(avatar: string) : Promise<User[]> {
        return this.userRepository.findByAvatar(avatar);
    }

    async saveUser(newUser: UserDTO) : Promise<User> {
        return await this.userRepository.saveUser(newUser);
    }

    async saveExternalUser(newExternalUser: UserDTO) {
        const url = `https://reqres.in/api/users`;
        
        this.httpService.post(url, newExternalUser).pipe(
            tap((resp) => console.log(resp)),
            map((resp) => resp.data),
            tap((data) => console.log(data))
        );

        console.log(newExternalUser)
    }

    async deleteUser(userID: string) {

        try{
            const UserExists = await this.userRepository.findById(userID);
            
            if(UserExists){
                const deletedUser = await this.userRepository.deleteUser(userID);

                if(deletedUser)
                    return 'This user was deleted successfully';

            } else {
                throw new BadRequestException('This user does not exist');
            }

        } catch(e) {
            throw new BadRequestException('This user does not exist');
        }

    }

    async updateUser(userID: string, user: UserDTO) {
        
        try{
            const UserExists = await this.userRepository.findById(userID);

            if(UserExists){
                const updatedUser = await this.userRepository.updateUser(userID, user);

                if(updatedUser)
                    return 'This user was updated successfully';

            } else {
                throw new BadRequestException('This user does not exist');
            }

        } catch(e) {
            throw new BadRequestException('This user does not exist');
        }

    }

}

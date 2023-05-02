import { Controller, Get, Post, Body, BadRequestException, Delete, Param, Put, Patch, Inject } from '@nestjs/common';
import { UsersService } from 'src/Services/users/users.service';
import { EmailService } from 'src/Services/email/email.service';
import { UserDTO } from 'src/DTO/user.dto';
import { User } from 'src/Mongo/Interfaces/user.interface';
import { ClientProxy, EventPattern } from '@nestjs/microservices';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService : UsersService,
        private readonly emailService : EmailService,
        @Inject('BACKEND_TASK_SERVICE') private readonly client: ClientProxy
    ) {}

    @Get()
    getAllUsers(): Promise<User[]> {
        return this.usersService.getAllUsers();
    }

    @Get('idMongo/:userID')
    async getUserByIdMongo(@Param('userID') userID: string) {
        return await this.usersService.getUserByIdMongo(userID);
    }

    @Get('idExterno/:userID')
    async getUserByIdExterno(@Param('userID') userID: string) {
        return await this.usersService.getUserByIdExterno(userID);
    }

    @Get('link/:avatar')
    async getAvatarByLink(@Param('avatar') avatar: string) {
        return await this.usersService.getAvatarByLink(avatar);
    }

    @Post()
    async saveUser(@Body() newUser : UserDTO): Promise<User> {
        const user = await this.usersService.saveUser(newUser);
        this.client.emit('user_created', newUser)
        return user;
    }

    @Post('/saveExternal')
    async saveExternalUser(@Body() newExternalUser : UserDTO) {
        const user = await this.usersService.saveExternalUser(newExternalUser);
        return user;
    }

    @Delete('idMongo/:userID')
    async deleteUser(@Param('userID') userID: string) {
        return await this.usersService.deleteUser(userID);
    }

    @Patch('idMongo/:userID')
    async updateUser(@Param('userID') userID: string, @Body() user: UserDTO) {
        return await this.usersService.updateUser(userID, user);
    }

    @Get('/mail')
    async sendMail(): Promise<void> {
        return await this.emailService.sendMail();
    }

    @EventPattern('user_created')
    async create(@Body() data : UserDTO){
        console.log(data)
        await this.usersService.saveExternalUser(data)
        return this.emailService.sendMail()
    }

}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'

import { UsersController } from './Controllers/users/users.controller'
import { UsersService } from './Services/users/users.service';
import { UserSchema } from './Mongo/Schema/user.schema';
import { UserRepository } from './Mongo/Repository/user.repository';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from 'nestjs-dotenv';
import { EmailService } from './Services/email/email.service';


@Module({
  imports: [

    ConfigModule.forRoot(),

    MongooseModule.forRoot('mongodb://localhost/users', { useNewUrlParser: true, useUnifiedTopology: true } ),
    
    MongooseModule.forFeature([
        {name: 'users', schema: UserSchema}
    ]),

    HttpModule,

    ClientsModule.register([
      {
        name: 'BACKEND_TASK_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: process.env.RABBITMQ_QUEUE,
          queueOptions: {
            durable: true
          },
        },
      },
    ]),

    MailerModule.forRoot({
      transport: {
        host: process.ENV.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER, //your e-mail here or use dotenv
          pass: process.env.SMTP_PASS, //your pass here or use dotenv
        },
      },
    }),
  ],
  controllers: [ UsersController ],
  providers: [ UsersService, EmailService, UserRepository ],
})

export class AppModule {}

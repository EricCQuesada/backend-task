import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {

    constructor(
        private readonly mailerService: MailerService
    ){}

    sendMail(): Promise<void> {
        return this.mailerService.sendMail({
            to: 'tomail@hotmail.com',
            from: 'youremail@hotmail.com',
            subject: 'Test nodemailer',
            text: 'show',
            html: '<b>Sending email after post via nestjs nodemailer - user created!</b>',
        });
    }
}

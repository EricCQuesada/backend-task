import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqps://enmmezlw:anz3ThOaEvBR1thz70_zy7-Xfxc9mL-s@cow.rmq2.cloudamqp.com/enmmezlw'],
      queue: 'backend-task-queue',
      queueOptions: {
        durable: true
      },
    },
  });

  await app.listen()
}
bootstrap();

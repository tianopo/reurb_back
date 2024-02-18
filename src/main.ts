import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const cors = {
    origin: ['http://localhost:3000'],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
  }

  app.enableCors(cors);
  await app.listen(3500);
}

bootstrap()
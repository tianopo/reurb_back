import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { NestExpressApplication } from "@nestjs/platform-express";

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const cors = {
    origin: ["http://localhost:3000"],
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS",
  };

  app.enableCors(cors);
  await app.listen(3500);
};

bootstrap();

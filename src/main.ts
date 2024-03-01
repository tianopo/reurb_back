import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./modules/app.module";

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const cors = {
    origin: ["http://localhost:9000"],
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS",
  };

  app.enableCors(cors);
  await app.listen(3500);
};

bootstrap();

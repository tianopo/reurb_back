import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as dotenv from "dotenv";
import { AppModule } from "./modules/app.module";
import { CustomValidationPipe } from "./pipes/custom-validation.pipe";

const bootstrap = async () => {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());

  const cors = {
    origin: [process.env.FRONTEND_HOST],
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS",
  };

  app.enableCors(cors);
  await app.listen(process.env.BACKEND_PORT ?? 3500);
};

bootstrap();

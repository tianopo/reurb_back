import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./modules/app.module";
import { CustomValidationPipe } from "./pipes/customValidation.pipe";

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());

  const cors = {
    origin: ["http://localhost:8999"],
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS",
  };

  app.enableCors(cors);
  await app.listen(3500);
};

bootstrap();

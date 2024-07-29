import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cors from "cors";
import * as dotenv from "dotenv";
import { HttpExceptionFilter } from "./err/http-exception.filter";
import { AppModule } from "./modules/app.module";
import { CustomValidationPipe } from "./pipes/custom-validation.pipe";
import { JwtAuthGuard } from "./guard/auth.guard";
import { RolesGuard } from "./guard/roles.guard";

const bootstrap = async () => {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(cors());

  await app.listen(process.env.BACKEND_PORT ?? 3500);
};

bootstrap();

import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cors from "cors";
import * as dotenv from "dotenv";
import { AppModule } from "./modules/app.module";
import { CustomValidationPipe } from "./pipes/custom-validation.pipe";

const bootstrap = async () => {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());

  const corsOptions = {
    origin: process.env.FRONTEND_HOST || "https://binance-front-psi.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };

  app.use(cors(corsOptions));

  await app.listen(process.env.BACKEND_PORT ?? 3500);
};

bootstrap();

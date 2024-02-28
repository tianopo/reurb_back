import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const ENV_API = {
  versão_build: "1.0.0",
  projeto: process.env.PROJETO,
  nodeEnv: process.env.NODE_ENV,
  database: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
  },
};

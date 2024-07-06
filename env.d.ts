declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'dev' | 'prod'
    DATABASE_DATABASE: string
    DATABASE_USERNAME: string
    DATABASE_PASSWORD: string
    DATABASE_HOST: string
    DATABASE_PORT: string
    DATABASE_URL: string

    FRONTEND_HOST: string
    BACKEND_PORT: string
    JWT_SECRET: string

    REDIS_HOST: string
    REDIS_PORT: string
    REDIS_DATABASE: string
  }
}
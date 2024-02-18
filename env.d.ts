declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
    DATABASE_DATABASE: string
    DATABASE_USERNAME: string
    DATABASE_PASSWORD: string
    DATABASE_HOST: string
    DATABASE_PORT: string
    DATABASE_URL: string
  }
}
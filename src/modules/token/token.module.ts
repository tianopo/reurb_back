import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TokenService } from "./token.service";

@Module({
  providers: [TokenService],
  imports: [
    JwtModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "15m",
      },
    }),
  ],
  exports: [TokenService],
})
export class TokenModule {}

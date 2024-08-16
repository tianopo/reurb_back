import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TokenModule } from "../token/token.module";
import { FinancialController } from "./financial.controller";
import { FinancialService } from "./financial.service";

@Module({
  controllers: [FinancialController],
  providers: [FinancialService],
  imports: [TokenModule, JwtModule],
})
export class FinancialModule {}

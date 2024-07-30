import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CustomError } from "../../err/custom/Error.filter";
import { TokenService } from "../token/token.service";
import { GetMembershipDto } from "./dto/get-membership.dto";
import { MembershipDto } from "./dto/membership.dto";
import { SendEmailService } from "./send-email.service";

@Controller("send")
export class SendEmailController {
  constructor(
    private readonly sendEmailService: SendEmailService,
    private readonly tokenService: TokenService,
  ) {}
  @Post("recover-password")
  recoverPassword() {
    return this.sendEmailService.recoverPassword();
  }

  @Post("receive-membership")
  receiveMembership(@Body() data: MembershipDto) {
    return this.sendEmailService.receiveMembership(data);
  }

  @Post("send-membership")
  sendMembership(@Body() data: GetMembershipDto) {
    return this.sendEmailService.sendMembership(data);
  }

  @Get(":token")
  async validateToken(@Param("token") token: string) {
    try {
      await this.tokenService.validateToken(token);
      return true;
    } catch (error) {
      throw new CustomError("Página não é válida");
    }
  }
}

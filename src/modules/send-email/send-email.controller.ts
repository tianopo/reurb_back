import { Body, Controller, Post } from "@nestjs/common";
import { MembershipDto } from "./dto/membership.dto";
import { SendEmailService } from "./send-email.service";

@Controller("send")
export class SendEmailController {
  constructor(private readonly recoverPasswordService: SendEmailService) {}
  @Post("recover-password")
  recoverPassword() {
    return this.recoverPasswordService.recoverPassword();
  }

  @Post("send-membership")
  sendMembership(@Body() data: MembershipDto) {
    return this.recoverPasswordService.sendMembership(data);
  }
}

import { Body, Controller, Post } from "@nestjs/common";
import { ReceiveMembershipDto } from "./dto/receive-membership.dto";
import { SendEmailService } from "./send-email.service";

@Controller("send")
export class SendEmailController {
  constructor(private readonly recoverPasswordService: SendEmailService) {}
  @Post("recover-password")
  recoverPassword() {
    return this.recoverPasswordService.recoverPassword();
  }

  @Post("receive-membership")
  receiveMembership(@Body() data: ReceiveMembershipDto) {
    return this.recoverPasswordService.sendMembership(data);
  }
}

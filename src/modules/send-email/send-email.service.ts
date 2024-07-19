import { Injectable } from "@nestjs/common";
import { sendEmail } from "../../utils/email/nodemailer";
import { termsTemplate } from "../../utils/email/template/recover-template";
import { ReceiveMembershipDto } from "./dto/receive-membership.dto";

@Injectable()
export class SendEmailService {
  recoverPassword() {
    // sendEmail('');
    return true;
  }

  sendMembership(data: ReceiveMembershipDto) {
    const emailBodyClient = termsTemplate(data.name, data.email, data.phone, data.CEP);
    sendEmail("Formulário de Adesão", emailBodyClient);

    return true;
  }
}

import { Injectable } from "@nestjs/common";
import { CustomError } from "../../err/custom/Error.filter";
import { sendEmail } from "../../utils/email/nodemailer";
import { recoverTemplate } from "../../utils/email/template/recover-template";
import { MembershipDto } from "./dto/membership.dto";

@Injectable()
export class SendEmailService {
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  recoverPassword() {
    // sendEmail('');
    return true;
  }

  async sendMembership(data: MembershipDto) {
    const emailBodyClient = recoverTemplate(data.nome, data.email, data.telefone, data.cep);
    try {
      await this.delay(2000);
      sendEmail("Formulário de Adesão", emailBodyClient);
    } catch (err) {
      throw new CustomError("Muitos e-mails enviados ao mesmo tempo, aguarde um pouco");
    }

    return true;
  }
}

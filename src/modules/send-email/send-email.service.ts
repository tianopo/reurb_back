import { Injectable } from "@nestjs/common";
import { CustomError } from "../../err/custom/Error.filter";
import { sendEmail } from "../../utils/email/nodemailer";
import { getMembershipTemplate } from "../../utils/email/template/get-membership";
import { recoverTemplate } from "../../utils/email/template/recover-template";
import { TokenService } from "../token/token.service";
import { GetMembershipDto } from "./dto/get-membership.dto";
import { MembershipDto } from "./dto/membership.dto";

@Injectable()
export class SendEmailService {
  constructor(private readonly tokenService: TokenService) {}
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  recoverPassword() {
    // sendEmail('');
    return true;
  }

  async receiveMembership(data: MembershipDto) {
    const emailBodyClient = recoverTemplate(data.nome, data.email, data.telefone, data.cep);
    try {
      await this.delay(2000);
      sendEmail("Formulário de Adesão", emailBodyClient);
    } catch (err) {
      throw new CustomError("Muitos e-mails enviados ao mesmo tempo, aguarde um pouco");
    }

    return true;
  }

  async sendMembership(data: GetMembershipDto) {
    const token = this.tokenService.generateToken(data.email);
    const pagina = `${process.env.FRONTEND_HOST}/formulario-adesao/${token}`;
    const emailBodyClient = getMembershipTemplate(data.nome, data.email, pagina);
    try {
      await this.delay(2000);
      sendEmail("Formulário de Registro na Reurb", emailBodyClient, data.email);
    } catch (err) {
      throw new CustomError("Muitos e-mails enviados ao mesmo tempo, aguarde um pouco");
    }

    return true;
  }
}

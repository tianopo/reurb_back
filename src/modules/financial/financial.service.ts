import { Injectable } from "@nestjs/common";
import { prisma } from "../../config/prisma-connection";
import { Role } from "../../decorators/roles.decorator";
import { CustomError } from "../../err/custom/Error.filter";
import { TokenService } from "../token/token.service";
import { FinancialDto } from "./dto/financial.dto";
import { FinancialUpdateDto } from "./dto/financialUpdate.dto";

@Injectable()
export class FinancialService {
  constructor(private readonly tokenService: TokenService) {}
  async create(data: FinancialDto) {
    const { nome, tipo, valor, status, pagamento, vencimento, clienteId } = data;
    await this.validateValuesExist(clienteId);

    const isNameInvalid = /.* - Parcela \d+$/.test(nome) || /Entrada/.test(nome);
    if (isNameInvalid) {
      throw new CustomError(
        "Não é permitido criar uma tarefa com uma descrição que corresponda aos padrões proibidos:' - Parcela (numero qualquer)' e 'Entrada'.",
      );
    }

    const create = await prisma.financial.create({
      data: {
        nome,
        tipo,
        valor,
        status,
        pagamento,
        vencimento,
        cliente: clienteId ? { connect: { id: clienteId } } : undefined,
      },
    });

    return create;
  }

  async list(authorization: string) {
    const token = authorization.replace("Bearer ", "");
    const user = await this.tokenService.validateToken(token);
    const { id, acesso, createdById } = user;

    const including = {
      cliente: {
        select: {
          id: true,
          nome: true,
        },
      },
    };

    if (acesso === Role.Gestor) {
      const financial = await prisma.financial.findMany({
        include: including,
        orderBy: { updated: "desc" },
      });
      return financial;
    } else if ([Role.Admin, Role.Funcionario].includes(acesso)) {
      const filterUserId = acesso === Role.Admin ? id : createdById;
      return await prisma.financial.findMany({
        where: {
          cliente: {
            createdById: filterUserId,
          },
        },
        include: including,
        orderBy: { updated: "desc" },
      });
    } else {
      throw new CustomError("Acesso não autorizado");
    }
  }

  async getId(id: string) {
    await this.validateId(id);
    return this.validateFinancialExists(id);
  }

  async update(id: string, data: FinancialUpdateDto) {
    const { nome, tipo, valor, status, pagamento, vencimento, cliente } = data;
    await this.validateId(id);
    await this.validateFinancialExists(id);
    if (cliente) await this.validateValuesExist(cliente.id);
    const update = await prisma.financial.update({
      where: { id },
      data: {
        nome,
        tipo,
        valor,
        status,
        pagamento,
        vencimento,
        cliente: cliente ? { connect: { id: cliente.id } } : { disconnect: true },
      },
    });

    return update;
  }

  async remove(id: string) {
    await this.validateId(id);
    return prisma.financial.delete({
      where: { id },
    });
  }

  private async validateFinancialExists(id: string) {
    const financial = await prisma.financial.findUnique({ where: { id } });
    if (!financial) throw new CustomError("Financeiro não encontrado.");
    return financial;
  }

  private async validateValuesExist(clienteId: string): Promise<void> {
    const errors: string[] = [];
    const promises = [];
    console.log(clienteId, "cliente");
    if (clienteId) {
      promises.push(prisma.user.findUnique({ where: { id: clienteId }, select: { id: true } }));
    }

    const [clienteExists] =
      promises.length > 0 ? await prisma.$transaction(promises) : [null, null];

    if (clienteId && !clienteExists) {
      errors.push(`Cliente com ID ${clienteId} não encontrado.`);
    }

    if (errors.length > 0) {
      throw new CustomError(errors.join(" "));
    }
  }

  private async validateId(id: string): Promise<void> {
    if (!id) throw new CustomError("ID de Financeiro é obrigatório.");
  }
}

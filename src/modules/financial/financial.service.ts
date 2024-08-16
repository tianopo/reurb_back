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
    const { nome, tipo, valor, status, pagamento, vencimento, contributionId, clienteId } = data;
    await this.validateValuesExist(contributionId, clienteId);

    const create = await prisma.financial.create({
      data: {
        nome,
        tipo,
        valor,
        status,
        pagamento,
        vencimento,
        contribution: contributionId ? { connect: { id: contributionId } } : undefined,
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
      return prisma.financial.findMany({
        include: including,
      });
    } else if ([Role.Admin, Role.Funcionario].includes(acesso)) {
      const filterUserId = acesso === Role.Admin ? id : createdById;
      return prisma.financial.findMany({
        where: {
          cliente: {
            createdById: filterUserId,
          },
        },
        include: including,
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
    const { nome, tipo, valor, status, pagamento, vencimento, contribution, cliente } = data;
    await this.validateId(id);
    await this.validateFinancialExists(id);
    await this.validateValuesExist(contribution.id, cliente.id);

    const update = await prisma.financial.update({
      where: { id },
      data: {
        nome,
        tipo,
        valor,
        status,
        pagamento,
        vencimento,
        cliente: cliente.id ? { connect: { id: cliente.id } } : { disconnect: true },
        contribution: contribution.id ? { connect: { id: contribution.id } } : { disconnect: true },
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

  private async validateValuesExist(contributionId: string, clienteId: string): Promise<void> {
    const errors: string[] = [];
    const promises = [];

    if (contributionId) {
      promises.push(
        prisma.contributions.findUnique({ where: { id: contributionId }, select: { id: true } }),
      );
    }

    if (clienteId) {
      promises.push(prisma.user.findUnique({ where: { id: clienteId }, select: { id: true } }));
    }

    const [contributionExists, clienteExists] =
      promises.length > 0 ? await prisma.$transaction(promises) : [null, null];

    if (contributionId && !contributionExists) {
      errors.push(`Contribuição com ID ${contributionId} não encontrada.`);
    }

    if (clienteId && !clienteExists) {
      errors.push(`Cliente com ID ${clienteId} não encontrado.`);
    }

    // Lança um erro se houver mensagens
    if (errors.length > 0) {
      throw new CustomError(errors.join(" "));
    }
  }

  private async validateId(id: string): Promise<void> {
    if (!id) throw new CustomError("ID de Financeiro é obrigatório.");
  }
}

import { Injectable } from "@nestjs/common";
import { Project } from "@prisma/client";
import { prisma } from "../../config/prisma-connection";
import { Role } from "../../decorators/roles.decorator";
import { CustomError } from "../../err/custom/Error.filter";
import { TokenService } from "../token/token.service";
import { ContributionDto } from "./dto/contribution.dto";
import { ProjectDto } from "./dto/project.dto";
import { ProjectUpdateDto } from "./dto/projectUpdate.dto";

@Injectable()
export class ProjectService {
  constructor(private readonly tokenService: TokenService) {}
  async create(data: ProjectDto) {
    const {
      nome,
      descricao,
      valorTotal,
      valorAcumulado,
      dataInicio,
      status,
      funcionarios,
      clientes,
      contributions,
    } = data;

    await this.validateContributions(contributions, valorAcumulado, valorTotal);
    await this.validateUsersExist(funcionarios, clientes);

    const projectTransaction = await prisma.$transaction(async (prisma) => {
      const createProject = await prisma.project.create({
        data: {
          nome,
          descricao,
          valorTotal,
          valorAcumulado,
          dataInicio,
          status,
          funcionarios: {
            connect: funcionarios?.map((funcionario) => ({ id: funcionario })),
          },
          clientes: {
            connect: clientes?.map((cliente) => ({ id: cliente })),
          },
        },
      });

      const tasksToCreate: any[] = [];
      const contributionPromises = contributions?.map(async (contribution) => {
        const financials = [];
        const numParcelas = parseInt(contribution.parcelas, 10);
        const valorParcela = parseFloat(contribution.valorParcela);

        const user = contribution.userId
          ? await prisma.user.findUnique({
              where: { id: contribution.userId },
            })
          : null;

        const createContribution = await prisma.contributions.create({
          data: {
            valor: contribution.valor,
            entrada: contribution.entrada,
            parcelas: contribution.parcelas,
            valorParcela: contribution.valorParcela,
            project: {
              connect: { id: createProject.id },
            },
            ...(contribution.userId
              ? {
                  user: {
                    connect: { id: contribution.userId },
                  },
                }
              : {}),
          },
        });

        for (let i = 0; i < numParcelas; i++) {
          const vencimentoDate = new Date();
          let vencimento = "";
          const diaDoMes = vencimentoDate.getDate() + 1;
          console.log(vencimentoDate, diaDoMes, dataInicio);

          if (diaDoMes <= 10) {
            vencimentoDate.setDate(20);
            vencimento = "20";
          } else if (diaDoMes <= 20) {
            vencimentoDate.setDate(30);
            vencimento = "30";
          } else {
            vencimentoDate.setDate(10);
            vencimento = "10";
          }
          vencimentoDate.setMonth(vencimentoDate.getMonth() + i);
          financials.push({
            nome: `Pagamento ${i + 1} - ${nome} - ${user.nome}`,
            tipo: "Entrada",
            valor: valorParcela.toString(),
            status: "Lançamentos",
            pagamento: "Outros",
            vencimento,
          });
          tasksToCreate.push({
            descricao: `${user.nome} - ${nome} - Parcela ${i + 1}`,
            data: vencimentoDate,
            prioridade: "Baixa",
            status: "à Fazer",
            projectId: createProject.id,
            contributionId: createContribution.id,
          });

          if (i === 0) {
            financials.push({
              nome: `Entrada - ${nome} - ${user.nome}`,
              tipo: "Entrada",
              valor: valorParcela.toString(),
              status: "Lançamentos",
              pagamento: "Outros",
              vencimento,
            });
            tasksToCreate.push({
              descricao: `${user.nome} - ${nome} - Entrada`,
              data: vencimentoDate,
              prioridade: "Baixa",
              status: "à Fazer",
              projectId: createProject.id,
              contributionId: createContribution.id,
            });
          }
        }

        await prisma.financial.createMany({
          data: financials.map((f) => ({
            nome: f.nome,
            tipo: f.tipo,
            valor: f.valor,
            status: f.status,
            pagamento: f.pagamento,
            vencimento: f.vencimento,
            contributionId: createContribution.id,
            clienteId: clientes?.[0] || null,
          })),
        });
        return createContribution;
      });
      await Promise.all(contributionPromises);

      if (tasksToCreate.length) {
        await prisma.task.createMany({
          data: tasksToCreate.map((task) => ({
            descricao: task.descricao,
            data: task.data,
            prioridade: task.prioridade,
            status: task.status,
            projectId: task.projectId,
            contributionId: task.contributionId,
          })),
        });
      }

      return createProject;
    });

    return projectTransaction;
  }

  async list(authorization: string) {
    const token = authorization.replace("Bearer ", "");
    const user = await this.tokenService.validateToken(token);

    const including = {
      funcionarios: {
        select: {
          id: true,
          nome: true,
        },
      },
      clientes: {
        select: {
          id: true,
          nome: true,
        },
      },
      contributions: {
        select: {
          id: true,
          valor: true,
          entrada: true,
          parcelas: true,
          valorParcela: true,
          userId: true,
        },
      },
    };

    if ([Role.Gestor, Role.Admin].includes(user.acesso)) {
      return prisma.project.findMany({
        include: {
          funcionarios: including.funcionarios,
          clientes: including.clientes,
          contributions: including.contributions,
        },
      });
    } else if (user.acesso === Role.Cliente) {
      return prisma.user.findMany({
        where: {
          projetosCli: {
            some: { id: user.id },
          },
        },
        include: {
          projetosCli: {
            include: including,
          },
        },
      });
    } else if (user.acesso === Role.Funcionario) {
      return prisma.project.findMany({
        where: {
          funcionarios: {
            some: { id: user.id },
          },
        },
        include: {
          funcionarios: including.funcionarios,
          clientes: including.clientes,
          contributions: including.contributions,
        },
      });
    } else {
      throw new CustomError("Acesso não autorizado");
    }
  }

  async getId(id: string) {
    await this.validateId(id);
    return this.validateProjectExists(id);
  }

  async update(id: string, data: ProjectUpdateDto) {
    const {
      nome,
      descricao,
      valorTotal,
      valorAcumulado,
      status,
      dataInicio,
      funcionarios,
      clientes,
      contributions,
    } = data;

    await this.validateContributions(contributions, valorAcumulado, valorTotal);
    await this.validateId(id);
    await this.validateProjectExists(id);

    if (funcionarios.length > 0 || clientes.length > 0) {
      const funcionarioIds = funcionarios.map((f) => f.id);
      const clienteIds = clientes.map((c) => c.id);
      await this.validateUsersExist(funcionarioIds, clienteIds);
    }

    return prisma.$transaction(async (prisma) => {
      const updateProject = await prisma.project.update({
        where: { id },
        data: {
          nome,
          descricao,
          valorTotal,
          valorAcumulado,
          status,
          dataInicio,
          funcionarios: {
            set:
              funcionarios?.length > 0
                ? funcionarios.map((funcionario) => ({ id: funcionario.id }))
                : [],
          },
          clientes: {
            set: clientes?.length > 0 ? clientes.map((cliente) => ({ id: cliente.id })) : [],
          },
        },
      });

      if (contributions && contributions.length > 0) {
        const currentContributions = await prisma.contributions.findMany({
          where: { projectId: updateProject.id },
          select: {
            id: true,
            valor: true,
            entrada: true,
            parcelas: true,
            valorParcela: true,
            userId: true,
          },
        });

        if (contributions.length < currentContributions.length) {
          const contributionUserIds = contributions.map((contribution) => contribution.userId);
          const contributionsToDelete = currentContributions.filter(
            (current) => !contributionUserIds.includes(current.userId),
          );
          if (contributionsToDelete.length > 0) {
            await prisma.contributions.deleteMany({
              where: {
                id: { in: contributionsToDelete.map((c) => c.id) },
              },
            });
          }
        } else if (contributions.length > currentContributions.length) {
          const tasksToCreate: any[] = [];
          const newContributions = contributions.filter((contribution) => {
            return !currentContributions.some((current) => current.userId === contribution.userId);
          });
          const contributionPromises = newContributions?.map(async (contribution) => {
            const financials = [];
            const numParcelas = parseInt(contribution.parcelas, 10);
            const valorParcela = parseFloat(contribution.valorParcela);

            const createContribution = await prisma.contributions.create({
              data: {
                valor: contribution.valor,
                entrada: contribution.entrada,
                parcelas: contribution.parcelas,
                valorParcela: contribution.valorParcela,
                project: {
                  connect: { id: updateProject.id },
                },
                ...(contribution.userId
                  ? {
                      user: {
                        connect: { id: contribution.userId },
                      },
                    }
                  : {}),
              },
            });

            const user = contribution.userId
              ? await prisma.user.findUnique({
                  where: { id: contribution.userId },
                })
              : null;

            for (let i = 0; i < numParcelas; i++) {
              const vencimentoDate = new Date();
              let vencimento = "";
              const diaDoMes = vencimentoDate.getDate() + 1;

              if (diaDoMes <= 10) {
                vencimentoDate.setDate(20);
                vencimento = "20";
              } else if (diaDoMes <= 20) {
                vencimentoDate.setDate(30);
                vencimento = "30";
              } else {
                vencimentoDate.setDate(10);
                vencimento = "10";
              }
              vencimentoDate.setMonth(vencimentoDate.getMonth() + i + currentContributions.length);
              financials.push({
                nome: `Pagamento ${i + 1} - ${nome} - ${user.nome}`,
                tipo: "Entrada",
                valor: valorParcela.toString(),
                status: "Lançamentos",
                pagamento: "Outros",
                vencimento,
              });
              tasksToCreate.push({
                descricao: `${user.nome} - ${nome} - Parcela ${i + 1}`,
                data: vencimentoDate,
                prioridade: "Baixa",
                status: "à Fazer",
                projectId: updateProject.id,
                contributionId: createContribution.id,
              });

              if (i === 0) {
                financials.push({
                  nome: `Entrada - ${nome} - ${user.nome}`,
                  tipo: "Entrada",
                  valor: valorParcela.toString(),
                  status: "Lançamentos",
                  pagamento: "Outros",
                  vencimento,
                });
                tasksToCreate.push({
                  descricao: `${user.nome} - ${nome} - Entrada`,
                  data: vencimentoDate,
                  prioridade: "Baixa",
                  status: "à Fazer",
                  projectId: updateProject.id,
                  contributionId: createContribution.id,
                });
              }
            }

            await prisma.financial.createMany({
              data: financials.map((f) => ({
                nome: f.nome,
                tipo: f.tipo,
                valor: f.valor,
                status: f.status,
                pagamento: f.pagamento,
                vencimento: f.vencimento,
                contributionId: createContribution.id,
                clienteId: clientes?.[0]?.id || null,
              })),
            });
            return createContribution;
          });
          await Promise.all(contributionPromises);

          if (tasksToCreate.length) {
            await prisma.task.createMany({
              data: tasksToCreate.map((task) => ({
                descricao: task.descricao,
                data: task.data,
                prioridade: task.prioridade,
                status: task.status,
                projectId: task.projectId,
                contributionId: task.contributionId,
              })),
            });
          }
        }

        const currentContributionMap = new Map(currentContributions.map((c) => [c.userId, c]));

        const updates = contributions.map(async (contribution) => {
          const key = contribution.userId;
          const current = currentContributionMap.get(key);

          const needsUpdate =
            !current ||
            current.valor !== contribution.valor ||
            current.entrada !== contribution.entrada ||
            current.parcelas !== contribution.parcelas ||
            current.valorParcela !== contribution.valorParcela;

          if (needsUpdate) {
            const user = contribution.userId
              ? await prisma.user.findUnique({
                  where: { id: contribution.userId },
                })
              : null;
            if (current) {
              // Atualizar contribuição existente
              await prisma.contributions.update({
                where: { id: current.id },
                data: {
                  valor: contribution.valor,
                  entrada: contribution.entrada,
                  parcelas: contribution.parcelas,
                  valorParcela: contribution.valorParcela,
                  user: contribution.userId ? { connect: { id: contribution.userId } } : undefined,
                },
              });

              // Inicializa a variável tasksToCreate
              const tasksToCreate: any[] = [];

              // Atualizar registros financeiros associados
              if (current.valor !== contribution.valor) {
                if (current.entrada !== contribution.entrada) {
                  await prisma.financial.updateMany({
                    where: {
                      contributionId: current.id,
                      nome: { startsWith: "Entrada" },
                    },
                    data: {
                      valor: contribution.entrada.toString(),
                    },
                  });
                }

                if (current.valorParcela !== contribution.valorParcela) {
                  await prisma.financial.updateMany({
                    where: {
                      contributionId: current.id,
                      nome: { startsWith: "Pagamento" },
                    },
                    data: {
                      valor: contribution.valorParcela.toString(),
                    },
                  });
                }
              }

              // Ajustar parcelas e tarefas
              const numParcelas = parseInt(contribution.parcelas, 10);
              const currentParcelas = await prisma.financial.findMany({
                where: { contributionId: current.id, nome: { startsWith: "Pagamento" } },
                orderBy: { vencimento: "asc" },
              });

              const currentParcelasCount = currentParcelas.length;

              if (numParcelas > currentParcelasCount) {
                // Adicionar novas parcelas e tarefas
                const financials: any[] = [];

                for (let i = currentParcelasCount; i < numParcelas; i++) {
                  const vencimentoDate = new Date();
                  let vencimento = "";
                  const diaDoMes = vencimentoDate.getDate() + 1;

                  if (diaDoMes <= 10) {
                    vencimentoDate.setDate(20);
                    vencimento = "20";
                  } else if (diaDoMes <= 20) {
                    vencimentoDate.setDate(30);
                    vencimento = "30";
                  } else {
                    vencimentoDate.setDate(10);
                    vencimento = "10";
                  }
                  vencimentoDate.setMonth(
                    vencimentoDate.getMonth() + i + currentContributions.length,
                  );

                  financials.push({
                    nome: `Pagamento ${i + 1} - ${nome} - ${user.nome}`,
                    tipo: "Entrada",
                    valor: contribution.valorParcela.toString(),
                    status: "Lançamentos",
                    pagamento: "Outros",
                    vencimento,
                    contributionId: current.id,
                    clienteId: clientes?.[0]?.id || null,
                  });

                  tasksToCreate.push({
                    descricao: `${user.nome} - ${nome} - Parcela ${i + 1}`,
                    data: vencimentoDate,
                    prioridade: "Baixa",
                    status: "à Fazer",
                    projectId: updateProject.id,
                    contributionId: current.id,
                  });

                  // Adiciona a primeira parcela (entrada)
                  if (i === 0) {
                    financials.push({
                      nome: `Entrada - ${nome} - ${user.nome}`,
                      tipo: "Entrada",
                      valor: contribution.entrada.toString(),
                      status: "Lançamentos",
                      pagamento: "Outros",
                      vencimento,
                      contributionId: current.id,
                      clienteId: clientes?.[0]?.id || null,
                    });

                    tasksToCreate.push({
                      descricao: `${user.nome} - ${nome} - Entrada`,
                      data: vencimentoDate,
                      prioridade: "Baixa",
                      status: "à Fazer",
                      projectId: updateProject.id,
                      contributionId: current.id,
                    });
                  }
                }

                await prisma.financial.createMany({
                  data: financials,
                });

                if (tasksToCreate.length) {
                  await prisma.task.createMany({
                    data: tasksToCreate,
                  });
                }
              } else if (numParcelas < currentParcelasCount) {
                // Remover parcelas e tarefas associadas
                const parcelsToDelete = currentParcelas.slice(numParcelas);
                const tasksToDelete = await prisma.task.findMany({
                  where: {
                    contributionId: current.id,
                    descricao: {
                      startsWith: `${user.nome} - ${nome} - Parcela `,
                    },
                  },
                });

                const tasksToDeleteIds = tasksToDelete
                  .filter((task) => {
                    const taskParcelaNumber = parseInt(task.descricao.split(" - Parcela ")[1], 10);
                    return taskParcelaNumber > numParcelas;
                  })
                  .map((task) => task.id);
                console.log(tasksToDeleteIds);
                if (tasksToDeleteIds.length > 0) {
                  await prisma.task.deleteMany({
                    where: {
                      id: { in: tasksToDeleteIds },
                    },
                  });
                }

                await prisma.financial.deleteMany({
                  where: {
                    id: { in: parcelsToDelete.map((p) => p.id) },
                  },
                });

                // Atualizar parcelas restantes
                const updatedParcelas = currentParcelas.slice(0, numParcelas);
                await Promise.all(
                  updatedParcelas.map(async (parcela, index) => {
                    const vencimentoDate = new Date();
                    let vencimento = "";
                    const diaDoMes = vencimentoDate.getDate();

                    if (diaDoMes <= 10) {
                      vencimentoDate.setDate(20);
                      vencimento = "20";
                    } else if (diaDoMes <= 20) {
                      vencimentoDate.setDate(30);
                      vencimento = "30";
                    } else {
                      vencimentoDate.setDate(10);
                      vencimento = "10";
                    }
                    vencimentoDate.setMonth(
                      vencimentoDate.getMonth() + index + currentContributions.length,
                    );

                    await prisma.financial.update({
                      where: { id: parcela.id },
                      data: {
                        vencimento,
                      },
                    });
                  }),
                );

                // Atualizar tarefas associadas
                const tasksToUpdate: any[] = [];
                updatedParcelas.forEach((parcela, index) => {
                  const task = tasksToCreate.find((t) =>
                    t.descricao.endsWith(`Parcela ${index + 1}`),
                  );
                  if (task) {
                    tasksToUpdate.push({
                      where: { id: task.id },
                      data: {
                        data: new Date(parcela.vencimento),
                      },
                    });
                  }
                });

                await Promise.all(
                  tasksToUpdate.map((taskUpdate) => prisma.task.update(taskUpdate)),
                );
              }
            }
          }

          return null;
        });

        await Promise.all(updates);
      }

      return updateProject;
    });
  }

  async remove(id: string) {
    await this.validateId(id);
    return prisma.project.delete({
      where: { id },
    });
  }

  private async validateContributions(
    contribuicoes: ContributionDto[],
    valorAcumulado: string,
    valorTotal: string,
  ) {
    let totalContribuicoes = 0;

    for (const contribuicao of contribuicoes) {
      const valor = Number(
        contribuicao.valor.replace("R$", "").replace(/\./g, "").replace(",", "."),
      );
      const entrada = Number(
        contribuicao.entrada.replace("R$", "").replace(/\./g, "").replace(",", "."),
      );
      const parcelas = Number(contribuicao.parcelas);
      const valorParcela = Number(
        contribuicao.valorParcela.replace("R$", "").replace(/\./g, "").replace(",", "."),
      );

      if (isNaN(valor) || isNaN(entrada) || isNaN(parcelas) || isNaN(valorParcela)) {
        throw new CustomError("Valores de contribuição devem ser numéricos válidos");
      }

      if (parcelas * valorParcela + entrada !== valor) {
        throw new CustomError(
          "O valor total da contribuição deve ser igual a (parcelas * valor parcelado) + entrada",
        );
      }

      totalContribuicoes += valor;
    }

    const acumulado = Number(valorAcumulado.replace("R$", "").replace(/\./g, "").replace(",", "."));
    const total = Number(valorTotal.replace("R$", "").replace(/\./g, "").replace(",", "."));
    if (totalContribuicoes !== acumulado)
      throw new CustomError("Valor acumulado tem que ser igual as contribuições");
    if (acumulado > total)
      throw new CustomError("Valor acumulado não pode ser maior que valor total");

    const userIdCounts = contribuicoes.reduce(
      (acc, contribution) => {
        if (contribution.userId) {
          acc[contribution.userId] = (acc[contribution.userId] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const repeatedUserIds = Object.keys(userIdCounts).filter((userId) => userIdCounts[userId] > 1);

    if (repeatedUserIds.length > 0) {
      throw new CustomError(`Pode ter apenas uma contribuição por usuário`);
    }
  }

  private async validateProjectExists(id: string): Promise<Project> {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new CustomError("Projeto não encontrado.");
    return project;
  }

  private async validateUsersExist(
    funcionarios: string[] = [],
    clientes: string[] = [],
  ): Promise<void> {
    if (funcionarios.length === 0 && clientes.length === 0) return;
    const allIds = [...new Set([...funcionarios, ...clientes])];

    const users = await prisma.user.findMany({
      where: { id: { in: allIds } },
      select: { id: true },
    });

    const existingUserIds = new Set(users.map((user) => user.id));

    const missingFuncionarios = funcionarios.filter((id) => !existingUserIds.has(id));
    const missingClientes = clientes.filter((id) => !existingUserIds.has(id));

    if (missingFuncionarios.length > 0 || missingClientes.length > 0) {
      let errorMessage = "";

      if (missingFuncionarios.length > 0)
        errorMessage += `Funcionários não encontrados: ${missingFuncionarios.join(", ")}. `;
      if (missingClientes.length > 0)
        errorMessage += `Clientes não encontrados: ${missingClientes.join(", ")}.`;

      throw new CustomError(errorMessage.trim());
    }
  }

  private async validateId(id: string): Promise<void> {
    if (!id) throw new CustomError("ID de Projeto é obrigatório.");
  }
}

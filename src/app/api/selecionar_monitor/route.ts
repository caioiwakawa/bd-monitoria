// app/api/selecionar-monitor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { codigo_oferta, matricula_aluno, horario } = await req.json();

    if (!codigo_oferta || !matricula_aluno || !horario) {
      return NextResponse.json({ error: 'Dados para seleção incompletos.' }, { status: 400 });
    }

    // Usamos uma transação para garantir que ambas as operações ocorram com sucesso
    await prisma.$transaction(async (tx) => {
      // 1. Cria o novo registo de monitor/tutor
      await tx.tb_monitoria_tutoria.create({
        data: {
          codigo_oferta_mon_tut: codigo_oferta,
          matricula_aluno_monitor_tutor: matricula_aluno,
          horario_mon_tut: horario,
        },
      });

      // 2. Remove a candidatura da lista de pendentes
      await tx.tb_candidaturas_oferta_mon_tut.delete({
        where: {
          tb_aluno_elegivel_tb_aluno_matricula_aluno_tb_oferta_mon_tut_codigo_oferta_mon_tut: {
            tb_aluno_elegivel_tb_aluno_matricula_aluno: matricula_aluno,
            tb_oferta_mon_tut_codigo_oferta_mon_tut: codigo_oferta,
          },
        },
      });
    });

    return NextResponse.json({ message: 'Aluno selecionado com sucesso!' }, { status: 201 });

  } catch (error) {
    console.error("Erro ao selecionar monitor:", error);
    // @ts-ignore
    if (error.code === 'P2002') { // Erro de violação de unicidade (já é monitor nesta oferta)
        return NextResponse.json({ error: 'Este aluno já foi selecionado como monitor para esta oferta.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erro interno ao selecionar monitor.' }, { status: 500 });
  }
}

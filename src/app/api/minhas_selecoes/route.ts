// app/api/minhas-selecoes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const matricula = searchParams.get('matricula');

  if (!matricula) {
    return NextResponse.json({ error: 'Matrícula do aluno ausente.' }, { status: 400 });
  }

  try {
    const selecoes = await prisma.tb_monitoria_tutoria.findMany({
      where: {
        matricula_aluno_monitor_tutor: parseInt(matricula),
      },
      include: {
        tb_oferta_mon_tut: {
          include: {
            tb_ofertas_e_turmas: {
              include: {
                tb_turma: {
                  include: {
                    tb_disciplina: {
                      select: { nome_disciplina: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // Formata o resultado para ser fácil de usar no frontend
    const resultadoFormatado = selecoes.map(s => ({
      tipo_oferta: s.tb_oferta_mon_tut.tipo_oferta,
      nome_disciplina: s.tb_oferta_mon_tut.tb_ofertas_e_turmas[0]?.tb_turma.tb_disciplina.nome_disciplina || 'Disciplina não especificada',
      numero_turma: s.tb_oferta_mon_tut.tb_ofertas_e_turmas[0]?.tb_turma.numero_turma || '',
    }));

    return NextResponse.json(resultadoFormatado);
  } catch (error) {
    console.error("Erro ao buscar seleções:", error);
    return NextResponse.json({ error: 'Erro interno ao buscar seleções.' }, { status: 500 });
  }
}

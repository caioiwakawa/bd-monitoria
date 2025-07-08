// app/api/minhas-candidaturas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Busca todas as candidaturas de um aluno
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const matricula = searchParams.get('matricula');

  if (!matricula) {
    return NextResponse.json({ error: 'Matrícula do aluno ausente.' }, { status: 400 });
  }

  try {
    const candidaturas = await prisma.tb_candidaturas_oferta_mon_tut.findMany({
      where: {
        tb_aluno_elegivel_tb_aluno_matricula_aluno: parseInt(matricula),
      },
      include: {
        tb_oferta_mon_tut: {
          include: {
            tb_ofertas_e_turmas: {
              take: 1, // Pega apenas a primeira disciplina associada para simplificar
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
    const resultadoFormatado = candidaturas.map(cand => ({
      codigo_oferta: cand.tb_oferta_mon_tut_codigo_oferta_mon_tut,
      tipo_oferta: cand.tb_oferta_mon_tut.tipo_oferta,
      nome_disciplina: cand.tb_oferta_mon_tut.tb_ofertas_e_turmas[0]?.tb_turma.tb_disciplina.nome_disciplina || 'Disciplina Genérica',
    }));

    return NextResponse.json(resultadoFormatado);
  } catch (error) {
    console.error("Erro ao buscar candidaturas:", error);
    return NextResponse.json({ error: 'Erro interno ao buscar candidaturas.' }, { status: 500 });
  }
}


// DELETE: Cancela/apaga uma candidatura específica
export async function DELETE(req: NextRequest) {
    try {
      const { matricula_aluno, codigo_oferta } = await req.json();
  
      if (!matricula_aluno || !codigo_oferta) {
        return NextResponse.json({ error: 'Dados para exclusão incompletos.' }, { status: 400 });
      }
  
      await prisma.tb_candidaturas_oferta_mon_tut.delete({
        where: {
          // A chave composta para identificar a candidatura a ser apagada
          tb_aluno_elegivel_tb_aluno_matricula_aluno_tb_oferta_mon_tut_codigo_oferta_mon_tut: {
            tb_aluno_elegivel_tb_aluno_matricula_aluno: matricula_aluno,
            tb_oferta_mon_tut_codigo_oferta_mon_tut: codigo_oferta,
          },
        },
      });
  
      return NextResponse.json({ message: 'Candidatura cancelada com sucesso.' });

    } catch (error) {
      console.error("Erro ao cancelar candidatura:", error);
      return NextResponse.json({ error: 'Erro ao cancelar candidatura.' }, { status: 500 });
    }
  }

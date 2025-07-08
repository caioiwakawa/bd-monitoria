// app/api/ofertas-professor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const matricula = searchParams.get('matricula');

  if (!matricula) {
    return NextResponse.json({ error: 'Matrícula do professor ausente.' }, { status: 400 });
  }

  try {
    const ofertas = await prisma.tb_oferta_mon_tut.findMany({
      where: {
        matricula_professor_responsavel: parseInt(matricula),
      },
      include: {
        tb_ofertas_e_turmas: {
          take: 1,
          include: {
            tb_turma: {
              include: {
                tb_disciplina: { select: { nome_disciplina: true } }
              }
            }
          }
        }
      }
    });

    const resultadoFormatado = ofertas.map(oferta => ({
      codigo_oferta: oferta.codigo_oferta_mon_tut,
      tipo_oferta: oferta.tipo_oferta,
      nome_disciplina: oferta.tb_ofertas_e_turmas[0]?.tb_turma.tb_disciplina.nome_disciplina || 'Disciplina Genérica',
    }));

    return NextResponse.json(resultadoFormatado);
  } catch (error) {
    console.error("Erro ao buscar ofertas do professor:", error);
    return NextResponse.json({ error: 'Erro interno ao buscar ofertas.' }, { status: 500 });
  }
}

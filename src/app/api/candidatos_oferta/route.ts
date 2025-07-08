// app/api/candidatos-oferta/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const codigoOferta = searchParams.get('codigoOferta');

  if (!codigoOferta) {
    return NextResponse.json({ error: 'Código da oferta ausente.' }, { status: 400 });
  }

  try {
    const candidaturas = await prisma.tb_candidaturas_oferta_mon_tut.findMany({
      where: {
        tb_oferta_mon_tut_codigo_oferta_mon_tut: parseInt(codigoOferta),
      },
      include: {
        tb_aluno_elegivel: {
          include: {
            tb_aluno: {
              select: {
                matricula_aluno: true,
                nome_aluno: true,
                ira: true,
              }
            }
          }
        }
      }
    });

    const resultadoFormatado = candidaturas.map(cand => ({
      matricula_aluno: cand.tb_aluno_elegivel.tb_aluno.matricula_aluno,
      nome_aluno: cand.tb_aluno_elegivel.tb_aluno.nome_aluno,
      ira: cand.tb_aluno_elegivel.tb_aluno.ira,
    }));

    return NextResponse.json(resultadoFormatado);
  } catch (error) {
    console.error("Erro ao buscar candidatos:", error);
    return NextResponse.json({ error: 'Erro interno ao buscar candidatos.' }, { status: 500 });
  }
}

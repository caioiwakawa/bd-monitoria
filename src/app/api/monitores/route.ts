// app/api/monitores/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const codigoOferta = searchParams.get('codigoOferta');

  if (!codigoOferta) {
    return NextResponse.json({ error: 'Código da oferta ausente' }, { status: 400 });
  }

  try {
    const monitoresDaOferta = await prisma.tb_monitoria_tutoria.findMany({
      where: {
        codigo_oferta_mon_tut: parseInt(codigoOferta),
      },
      include: {
        tb_aluno_elegivel: {
          include: {
            tb_aluno: {
              select: {
                matricula_aluno: true,
                nome_aluno: true,
                foto_perfil: true,
              },
            },
          },
        },
      },
    });

    const formatado = monitoresDaOferta.map((monitoria) => ({
      matricula: monitoria.tb_aluno_elegivel.tb_aluno.matricula_aluno,
      nome: monitoria.tb_aluno_elegivel.tb_aluno.nome_aluno,
      foto: monitoria.tb_aluno_elegivel.tb_aluno.foto_perfil
        ? Buffer.from(monitoria.tb_aluno_elegivel.tb_aluno.foto_perfil).toString('base64')
        : null,
    }));

    return NextResponse.json(formatado);
  } catch (error) {
    console.error('Erro ao buscar monitores:', error);
    return NextResponse.json({ error: 'Erro ao buscar monitores' }, { status: 500 });
  }
}
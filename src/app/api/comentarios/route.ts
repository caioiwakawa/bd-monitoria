import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Buscar todos os comentários de uma oferta
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const codigoOferta = searchParams.get('codigoOferta');
  const matriculaMonitor = searchParams.get('matriculaMonitor');

  if (!codigoOferta || !matriculaMonitor) {
    return NextResponse.json({ error: 'Parâmetros ausentes' }, { status: 400 });
  }

  try {
    const comentarios = await prisma.tb_avaliacao_mon_tut.findMany({
      where: {
        codigo_oferta_mon_tut: parseInt(codigoOferta),
        matricula_aluno_monitor_tutor: parseInt(matriculaMonitor)
      },
      include: {
        tb_aluno_matriculado: {
          include: {
            tb_aluno: {
              select: {
                nome_aluno: true,
                foto_perfil: true,
              }
            }
          }
        }
      },
      orderBy: {
        matricula_aluno_avaliador: 'asc'
      }
    });

    const formatado = comentarios.map(com => ({
      matricula: com.matricula_aluno_avaliador,
      comentario: com.comentario_avaliacao,
      nota: com.nota_avaliacao,
      nome: com.tb_aluno_matriculado.tb_aluno.nome_aluno,
      foto: com.tb_aluno_matriculado.tb_aluno.foto_perfil 
        ? Buffer.from(com.tb_aluno_matriculado.tb_aluno.foto_perfil).toString('base64')
        : null
    }));

    return NextResponse.json(formatado);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar comentários' }, { status: 500 });
  }
}

// POST: Enviar um novo comentário
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { codigoOferta, matriculaMonitor, matriculaAvaliador, comentario, nota } = body;

  if (!codigoOferta || !matriculaMonitor || !matriculaAvaliador || !comentario || nota == null) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  try {
    await prisma.tb_avaliacao_mon_tut.create({
      data: {
        codigo_oferta_mon_tut: codigoOferta,
        matricula_aluno_monitor_tutor: matriculaMonitor,
        matricula_aluno_avaliador: matriculaAvaliador,
        comentario_avaliacao: comentario,
        nota_avaliacao: nota
      }
    });

    return NextResponse.json({ message: 'Comentário adicionado com sucesso' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao enviar comentário' }, { status: 500 });
  }
}

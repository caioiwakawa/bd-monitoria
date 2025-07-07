// app/api/comentarios/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET: Busca comentários (sem alterações)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const codigoOferta = searchParams.get('codigoOferta');
  const matriculaMonitor = searchParams.get('matriculaMonitor');

  if (!codigoOferta || !matriculaMonitor) {
    return NextResponse.json({ error: 'Código da oferta ou do monitor ausente na requisição GET.' }, { status: 400 });
  }

  try {
    const comentarios = await prisma.tb_avaliacao_mon_tut.findMany({
      where: {
        codigo_oferta_mon_tut: parseInt(codigoOferta),
        matricula_aluno_monitor_tutor: parseInt(matriculaMonitor),
      },
      include: {
        tb_aluno_matriculado: {
          include: {
            tb_aluno: { select: { nome_aluno: true, foto_perfil: true } },
          },
        },
      },
      orderBy: { matricula_aluno_avaliador: 'asc' },
    });

    const formatado = comentarios.map((com) => ({
      matricula: com.matricula_aluno_avaliador,
      comentario: com.comentario_avaliacao,
      nota: com.nota_avaliacao,
      nome: com.tb_aluno_matriculado.tb_aluno.nome_aluno,
      foto: com.tb_aluno_matriculado.tb_aluno.foto_perfil
        ? Buffer.from(com.tb_aluno_matriculado.tb_aluno.foto_perfil).toString('base64')
        : null,
    }));
    return NextResponse.json(formatado);
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return NextResponse.json({ error: 'Erro ao buscar comentários' }, { status: 500 });
  }
}

// POST: AGORA APENAS CRIA, e verifica se já existe uma avaliação
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    codigoOfertaMonTut,
    matriculaAlunoMonitorTutor,
    matriculaAlunoAvaliador,
    comentarioAvaliacao,
    notaAvaliacao,
  } = body;

  if (!codigoOfertaMonTut || !matriculaAlunoMonitorTutor || !matriculaAlunoAvaliador || !comentarioAvaliacao || notaAvaliacao == null) {
    return NextResponse.json({ error: 'Dados incompletos recebidos pelo backend.' }, { status: 400 });
  }

  try {
    // 1. VERIFICAR se já existe uma avaliação com esta chave primária
    const avaliacaoExistente = await prisma.tb_avaliacao_mon_tut.findUnique({
      where: {
        codigo_oferta_mon_tut_matricula_aluno_monitor_tutor_matricula_aluno_avaliador: {
          codigo_oferta_mon_tut: codigoOfertaMonTut,
          matricula_aluno_monitor_tutor: matriculaAlunoMonitorTutor,
          matricula_aluno_avaliador: matriculaAlunoAvaliador,
        },
      },
    });

    // 2. Se já existir, retorna um erro 409 (Conflict) com uma mensagem clara
    if (avaliacaoExistente) {
      return NextResponse.json(
        { error: 'Você já avaliou este monitor. Para alterar sua avaliação, edite-a no seu perfil.' },
        { status: 409 } // 409 Conflict é o status HTTP correto para este caso
      );
    }

    // 3. Se não existir, CRIA a nova avaliação
    const novaAvaliacao = await prisma.tb_avaliacao_mon_tut.create({
      data: {
        codigo_oferta_mon_tut: codigoOfertaMonTut,
        matricula_aluno_monitor_tutor: matriculaAlunoMonitorTutor,
        matricula_aluno_avaliador: matriculaAlunoAvaliador,
        comentario_avaliacao: comentarioAvaliacao,
        nota_avaliacao: notaAvaliacao,
      },
    });

    return NextResponse.json(novaAvaliacao, { status: 201 }); // 201 Created

  } catch (error: any) {
    console.error("Erro ao criar avaliação:", error);
    // Trata outros erros possíveis, como uma chave estrangeira inválida
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        const failedField = error.meta?.field_name;
        return NextResponse.json({ error: 'Erro de Referência no Banco de Dados.', details: `A inserção falhou porque a referência no campo '${failedField}' não aponta para um registo existente.`}, { status: 409 });
    }
    return NextResponse.json({ error: 'Erro interno ao tentar salvar a avaliação.' }, { status: 500 });
  }
}

// app/api/meu_comentario/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Busca todos os comentários feitos por um aluno específico
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const matricula = searchParams.get('matricula');

  if (!matricula) {
    return NextResponse.json({ error: 'Matrícula do aluno ausente.' }, { status: 400 });
  }

  try {
    const avaliacoes = await prisma.tb_avaliacao_mon_tut.findMany({
      where: {
        matricula_aluno_avaliador: parseInt(matricula),
      },
      include: {
        // CORREÇÃO PRINCIPAL:
        // 1. Buscamos os dados do monitor APENAS para saber o nome dele.
        tb_monitoria_tutoria: {
          include: {
            tb_aluno_elegivel: {
              include: {
                tb_aluno: { select: { nome_aluno: true } }, // Só precisamos do nome do monitor
              },
            },
          },
        },
        // 2. Buscamos os dados do autor do comentário (o avaliador) para obter a foto e o nome.
        tb_aluno_matriculado: {
            include: {
                tb_aluno: { select: { nome_aluno: true, matricula_aluno: true } } // Pegamos a matrícula para a foto
            }
        }
      },
      orderBy: {
        codigo_oferta_mon_tut: 'desc',
      },
    });
    
    // Formata os dados para o frontend, agora com a distinção clara
    const formatado = avaliacoes.map(aval => ({
        id_composto: {
            codigo_oferta_mon_tut: aval.codigo_oferta_mon_tut,
            matricula_aluno_monitor_tutor: aval.matricula_aluno_monitor_tutor,
            matricula_aluno_avaliador: aval.matricula_aluno_avaliador,
        },
        comentario: aval.comentario_avaliacao,
        nota: aval.nota_avaliacao,
        // Dados do autor do comentário (para a foto e nome)
        autor: {
            nome: aval.tb_aluno_matriculado?.tb_aluno?.nome_aluno || 'Você',
            matricula: aval.tb_aluno_matriculado?.tb_aluno?.matricula_aluno,
        },
        // Dados do monitor (apenas para contexto)
        monitor: {
            nome: aval.tb_monitoria_tutoria?.tb_aluno_elegivel?.tb_aluno?.nome_aluno || 'Monitor não encontrado',
        }
    }));

    return NextResponse.json(formatado);
  } catch (error) {
    console.error("Erro ao buscar meus comentários:", error);
    return NextResponse.json({ error: 'Erro interno ao buscar comentários.' }, { status: 500 });
  }
}

// As suas funções PUT e DELETE permanecem exatamente iguais.
export async function PUT(req: NextRequest) {
  // ... seu código PUT aqui, sem alterações
  try {
    const { id_composto, novo_comentario, nova_nota } = await req.json();
    if (!id_composto || !novo_comentario || nova_nota == null) {
      return NextResponse.json({ error: 'Dados para edição incompletos.' }, { status: 400 });
    }
    const comentarioAtualizado = await prisma.tb_avaliacao_mon_tut.update({
      where: {
        codigo_oferta_mon_tut_matricula_aluno_monitor_tutor_matricula_aluno_avaliador: id_composto,
      },
      data: {
        comentario_avaliacao: novo_comentario,
        nota_avaliacao: nova_nota,
      },
    });
    return NextResponse.json(comentarioAtualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar comentário.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  // ... seu código DELETE aqui, sem alterações
  try {
    const { id_composto } = await req.json();
    if (!id_composto) {
      return NextResponse.json({ error: 'ID do comentário ausente.' }, { status: 400 });
    }
    await prisma.tb_avaliacao_mon_tut.delete({
      where: {
        codigo_oferta_mon_tut_matricula_aluno_monitor_tutor_matricula_aluno_avaliador: id_composto,
      },
    });
    return NextResponse.json({ message: 'Comentário apagado com sucesso.' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao apagar comentário.' }, { status: 500 });
  }
}

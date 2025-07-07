// /api/inscrever_monitoria/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Use a sua instância partilhada

export async function POST(req: NextRequest) {
  try {
    const { matricula_aluno, codigo_oferta_mon_tut } = await req.json();

    if (!matricula_aluno || !codigo_oferta_mon_tut) {
      return NextResponse.json(
        { error: 'Matrícula do aluno e código da oferta são obrigatórios.' },
        { status: 400 }
      );
    }

    // --- NOVA LÓGICA DE VERIFICAÇÃO DE ELEGIBILIDADE ---

    // 1. Descobrir qual(is) disciplina(s) esta oferta exige.
    const disciplinasDaOferta = await prisma.tb_ofertas_e_turmas.findMany({
      where: { codigo_oferta_mon_tut: codigo_oferta_mon_tut },
      select: { codigo_disciplina: true },
    });

    if (disciplinasDaOferta.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma disciplina encontrada para esta oferta de monitoria.' },
        { status: 404 }
      );
    }
    const codigosDisciplinasExigidas = disciplinasDaOferta.map(d => d.codigo_disciplina);

    // 2. Verificar se o aluno JÁ CURSOU e foi aprovado em TODAS as disciplinas exigidas.
    const disciplinasCursadasPeloAluno = await prisma.tb_cursou_disciplina.count({
        where: {
            tb_aluno_elegivel_tb_aluno_matricula_aluno: matricula_aluno,
            tb_disciplina_codigo_disciplina: { in: codigosDisciplinasExigidas }
        }
    });

    if (disciplinasCursadasPeloAluno < codigosDisciplinasExigidas.length) {
        return NextResponse.json(
            { error: 'Você não cumpre o pré-requisito de ter sido aprovado em todas as disciplinas desta oferta.' },
            { status: 403 } // 403 Forbidden é apropriado aqui
        );
    }

    // 3. (Opcional, mas recomendado) Verificar se o aluno NÃO ESTÁ CURSANDO a disciplina atualmente.
    const alunoEstaCursando = await prisma.tb_matriculado_em_disciplina.findFirst({
        where: {
            tb_aluno_matricula: matricula_aluno,
            tb_turma_codigo_disciplina: { in: codigosDisciplinasExigidas }
        }
    });

    if (alunoEstaCursando) {
        return NextResponse.json(
            { error: 'Você não pode ser monitor de uma disciplina que está cursando atualmente.' },
            { status: 403 }
        );
    }

    // --- FIM DA NOVA LÓGICA ---

    // 4. Manter a verificação para evitar inscrições duplicadas.
    const inscricaoExistente = await prisma.tb_candidaturas_oferta_mon_tut.findUnique({
      where: {
        tb_aluno_elegivel_tb_aluno_matricula_aluno_tb_oferta_mon_tut_codigo_oferta_mon_tut: {
          tb_aluno_elegivel_tb_aluno_matricula_aluno: matricula_aluno,
          tb_oferta_mon_tut_codigo_oferta_mon_tut: codigo_oferta_mon_tut,
        },
      },
    });

    if (inscricaoExistente) {
      return NextResponse.json(
        { error: 'Você já se candidatou para esta oferta.' },
        { status: 409 } // 409 Conflict
      );
    }

    // 5. Se todas as verificações passarem, realiza a inscrição.
    const novaInscricao = await prisma.tb_candidaturas_oferta_mon_tut.create({
      data: {
        tb_aluno_elegivel_tb_aluno_matricula_aluno: matricula_aluno,
        tb_oferta_mon_tut_codigo_oferta_mon_tut: codigo_oferta_mon_tut,
      },
    });

    return NextResponse.json(novaInscricao, { status: 201 });

  } catch (error) {
    console.error('Erro ao inscrever na monitoria:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

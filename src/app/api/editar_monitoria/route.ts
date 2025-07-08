import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Validação dos dados de entrada
    if (
      !body.codigoOferta ||
      !body.tipo ||
      !body.descricao ||
      !body.cargaHoraria ||
      !body.bolsa
    ) {
      return NextResponse.json(
        {
          error:
            "Todos os campos obrigatórios devem ser fornecidos e preenchidos da forma correta",
        },
        { status: 400 }
      );
    }

    // Verificar se a oferta existe
    const ofertaExistente = await prisma.tb_oferta_mon_tut.findUnique({
      where: {
        codigo_oferta_mon_tut: body.codigoOferta,
      },
      include: {
        tb_ofertas_e_turmas: {
          include: {
            tb_turma: {
              include: {
                tb_disciplina: true,
              },
            },
          },
        },
      },
    });

    if (!ofertaExistente) {
      return NextResponse.json(
        { error: "Oferta não encontrada" },
        { status: 404 }
      );
    }

    // Atualizar a oferta
    const ofertaAtualizada = await prisma.tb_oferta_mon_tut.update({
      where: {
        codigo_oferta_mon_tut: body.codigoOferta,
      },
      data: {
        tipo_oferta: body.tipo,
        desc_oferta: body.descricao,
        carga_horaria_oferta: body.cargaHoraria,
        bolsa_oferta: body.bolsa,
        matricula_professor_responsavel: body.matriculaProfessorResponsavel,
      },
      include: {
        tb_ofertas_e_turmas: {
          include: {
            tb_turma: {
              include: {
                tb_disciplina: true,
              },
            },
          },
        },
      },
    });

    // Formatar a resposta igual ao GET
    const turma = ofertaAtualizada.tb_ofertas_e_turmas[0]?.tb_turma;
    const disciplina = turma?.tb_disciplina;

    const resultado = {
      codigoOferta: ofertaAtualizada.codigo_oferta_mon_tut,
      tipo: ofertaAtualizada.tipo_oferta,
      descricao: ofertaAtualizada.desc_oferta,
      cargaHoraria: ofertaAtualizada.carga_horaria_oferta,
      bolsa: ofertaAtualizada.bolsa_oferta,
      matriculaProfessorResponsavel:
        ofertaAtualizada.matricula_professor_responsavel,
      nomeDisciplina: disciplina
        ? `${disciplina.codigo_disciplina} ${disciplina.codigo_departamento} - ${disciplina.nome_disciplina}`
        : "Disciplina não encontrada",
    };

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro ao atualizar oferta:", error);
    return NextResponse.json(
      {
        error: "Erro ao atualizar oferta",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

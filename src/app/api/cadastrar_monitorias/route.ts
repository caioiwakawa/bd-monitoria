import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      matricula_professor_responsavel,
      tipo_oferta,
      desc_oferta,
      carga_horaria_oferta,
      bolsa_oferta,
      turmas,
    } = body;

    // Validação básica
    if (!turmas || !Array.isArray(turmas) || turmas.length === 0) {
      return NextResponse.json(
        { error: "Turmas não fornecidas." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar a oferta
      const oferta = await tx.tb_oferta_mon_tut.create({
        data: {
          matricula_professor_responsavel: Number(
            matricula_professor_responsavel
          ),
          tipo_oferta,
          desc_oferta,
          carga_horaria_oferta: Number(carga_horaria_oferta),
          bolsa_oferta: Number(bolsa_oferta),
        },
      });

      // 2. Criar turmas associadas manualmente
      for (const turma of turmas) {
        await tx.tb_ofertas_e_turmas.create({
          data: {
            codigo_oferta_mon_tut: oferta.codigo_oferta_mon_tut,
            codigo_disciplina: turma.codigo_disciplina,
            numero_turma: Number(turma.numero_turma),
            semestre_turma: turma.semestre_turma,
          },
        });
      }

      // 3. Retornar oferta com turmas associadas
      return tx.tb_oferta_mon_tut.findUnique({
        where: { codigo_oferta_mon_tut: oferta.codigo_oferta_mon_tut },
        include: {
          tb_ofertas_e_turmas: true,
        },
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar oferta:", error);
    return NextResponse.json(
      {
        error: "Erro ao criar oferta",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

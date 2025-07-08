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
      matricula_aluno_monitor_tutor,
      horario_mon_tut,
    } = body;

    if (!turmas || !Array.isArray(turmas) || turmas.length === 0) {
      return NextResponse.json(
        { error: "Turmas não fornecidas." },
        { status: 400 }
      );
    }

    if (!matricula_aluno_monitor_tutor || !horario_mon_tut) {
      return NextResponse.json(
        { error: "Dados do monitor/tutor ausentes." },
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

      // 2. Inserir turmas associadas
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

      // 3. Inserir monitor/tutor vinculado à oferta
      await tx.tb_monitoria_tutoria.create({
        data: {
          codigo_oferta_mon_tut: oferta.codigo_oferta_mon_tut,
          matricula_aluno_monitor_tutor: Number(matricula_aluno_monitor_tutor),
          horario_mon_tut,
        },
      });

      // 4. Retornar oferta criada com turmas
      return tx.tb_oferta_mon_tut.findUnique({
        where: { codigo_oferta_mon_tut: oferta.codigo_oferta_mon_tut },
        include: {
          tb_ofertas_e_turmas: true,
        },
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar oferta:", error);

    // Checa se é conflito de chave primária
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Monitoria/Tutoria já cadastrada para esta oferta." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Erro ao criar oferta",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

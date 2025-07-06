import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const turmas = await prisma.tb_turma.findMany({
      include: {
        tb_disciplina: true,
        tb_professor: true,
      },
    });

    const resultado = turmas.map((turma) => ({
      codigo_disciplina: turma.tb_disciplina.codigo_disciplina,
      nome_disciplina: turma.tb_disciplina.nome_disciplina,
      numero_turma: turma.numero_turma,
      semestre_turma: turma.semestre_turma,
      professor: turma.tb_professor.nome_professor,
      matricula_professor: turma.tb_professor.matricula_professor,
    }));

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro ao buscar turmas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar turmas", detalhe: String(error) },
      { status: 500 }
    );
  }
}

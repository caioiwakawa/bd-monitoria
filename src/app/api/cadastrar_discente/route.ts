import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const matricula_aluno = parseInt(form.get("matricula") as string);
  const nome_aluno = form.get("nome") as string;
  const email_aluno = form.get("email") as string;
  const cpf_aluno = form.get("cpf") as string;
  const semestre_ingresso_aluno = form.get("semestre") as string;
  const ira = parseFloat(form.get("ira") as string);
  const status_aluno = form.get("status") as string;
  const nomeCurso = form.get("curso") as string;

  try {
    const curso = await prisma.curso.findFirst({
      where: { nome_curso: nomeCurso },
    });

    if (!curso) {
      return NextResponse.json({ erro: "Curso não encontrado" }, { status: 400 });
    }

    const aluno = await prisma.aluno.create({
      data: {
        matricula_aluno,
        nome_aluno,
        email_aluno,
        cpf_aluno,
        semestre_ingresso_aluno,
        ira,
        status_aluno,
        codigo_curso: curso.codigo_curso,
      },
    });

    return NextResponse.json({ ok: true, aluno });
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    return NextResponse.json({ erro: "Erro ao cadastrar aluno" }, { status: 500 });
  }
}

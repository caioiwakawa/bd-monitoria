import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("foto_perfil") as File | null;

  let fotoBuffer: Buffer | null = null;

  if (file && file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    fotoBuffer = Buffer.from(arrayBuffer);
  }

  const matricula_aluno = parseInt(form.get("matricula") as string);
  const nome_aluno = form.get("nome") as string;
  const email_aluno = form.get("email") as string;
  const cpf_aluno = form.get("cpf") as string;
  const semestre_ingresso_aluno = form.get("semestre") as string;
  const ira = parseFloat(form.get("ira") as string);
  const status_aluno = form.get("status") as string;
  const nomeCurso = form.get("curso") as string;
  const telefones = form.getAll('telefones[]') as string[]

  try {
    const curso = await prisma.tb_curso.findFirst({
      where: { nome_curso: nomeCurso },
    });

    if (!curso) {
      return NextResponse.json({ erro: "Curso não encontrado" }, { status: 400 });
    }

    const aluno = await prisma.tb_aluno.create({
      data: {
        matricula_aluno,
        nome_aluno,
        email_aluno,
        cpf_aluno,
        semestre_ingresso_aluno,
        ira,
        status_aluno,
        tb_curso_codigo_curso: curso.codigo_curso,
        foto_perfil: fotoBuffer,
      },
    });

  for (const numero of telefones) {
    if (numero.trim() === '') continue;

    await prisma.tb_aluno_telefones.create({
      data: {
        num_telefone_aluno: numero,
        tb_aluno_matricula_aluno: matricula_aluno,
      },
    });
  }



  const jaElegivel = await prisma.tb_aluno_elegivel.findUnique({
    where: { tb_aluno_matricula_aluno: matricula_aluno }
  });

  if (!jaElegivel) {
    await prisma.tb_aluno_elegivel.create({
      data: { tb_aluno_matricula_aluno: matricula_aluno }
    });
  }


    return NextResponse.json({ ok: true, aluno });
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    return NextResponse.json({ erro: "Erro ao cadastrar aluno" }, { status: 500 });
  }
}

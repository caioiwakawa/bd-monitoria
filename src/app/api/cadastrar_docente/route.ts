import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const matricula_professor = parseInt(form.get("matricula") as string);
  const nome_professor = form.get("nome") as string;
  const email_professor = form.get("email") as string;
  const cpf_professor = form.get("cpf") as string;
  const data_contratacao_professor = form.get("data contratacao") as string;
  const data_contratacao = new Date(data_contratacao_professor as string);


  try {

    const professor = await prisma.professor.create({
      data: {
        matricula_professor,
        nome_professor,
        email_professor,
        cpf_professor,
        data_contratacao_professor: data_contratacao,
      },
    });

    return NextResponse.json({ ok: true, professor });
  } catch (error) {
    console.error("Erro ao cadastrar professor:", error);
    return NextResponse.json({ erro: "Erro ao cadastrar professor" }, { status: 500 });
  }
}

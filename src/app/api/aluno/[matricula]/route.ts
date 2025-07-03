import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { matricula: string } }
) {
  const matricula = parseInt(params.matricula);

  try {
    // Busca todos os dados do aluno EXCETO foto_perfil
    const aluno = await prisma.aluno.findUnique({
      where: { matricula_aluno: matricula },
      select: {
        matricula_aluno: true,
        nome_aluno: true,
        email_aluno: true,
        cpf_aluno: true,
        semestre_ingresso_aluno: true,
        ira: true,
        status_aluno: true,
        codigo_curso: true,
        // Não incluir foto_perfil aqui!
      },
    });

    if (!aluno) {
      return new NextResponse("Aluno não encontrado", { status: 404 });
    }

    return NextResponse.json(aluno);
  } catch (error) {
    console.error("Erro ao buscar aluno:", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

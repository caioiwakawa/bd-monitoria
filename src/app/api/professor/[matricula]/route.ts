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
    const professor = await prisma.tb_professor.findUnique({
      where: { matricula_professor: matricula },
      select: {
        matricula_professor: true,
        nome_professor: true,
        email_professor: true,
        cpf_professor: true,
        data_contratacao_professor: true,
        // Não incluir foto_perfil aqui!
      },
    });

    if (!professor) {
      return new NextResponse("Professor não encontrado", { status: 404 });
    }

    return NextResponse.json(professor);
  } catch (error) {
    console.error("Erro ao buscar professor:", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { matricula: string } }
) {
    const matricula = parseInt(params.matricula);

    try {
        await prisma.tb_professor.delete({
            where: { matricula_professor: matricula }
        });

        return new NextResponse("Professor removido", { status: 200 });
    } catch (error) {
        console.error("Erro ao remover professor:", error);  
        return new NextResponse("Erro interno", { status: 500 });      
    }
}
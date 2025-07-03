import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { matricula: string } }
) {
  const matricula = parseInt(params.matricula);

  try {
    const aluno = await prisma.aluno.findUnique({
      where: { matricula_aluno: matricula },
      select: { foto_perfil: true },
    });

    if (!aluno || !aluno.foto_perfil) {
      return new NextResponse("Imagem não encontrada", { status: 404 });
    }

    return new NextResponse(aluno.foto_perfil, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml", // SVG aqui!
        "Content-Length": aluno.foto_perfil.length.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar foto:", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

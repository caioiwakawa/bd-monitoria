import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { matricula: string } }
) {
  const matricula = parseInt(params.matricula);

  try {
    const professor = await prisma.tb_professor.findUnique({
      where: { matricula_professor: matricula },
      select: { foto_perfil_professor: true },
    });

    if (!professor || !professor.foto_perfil_professor) {
      return new NextResponse("Imagem não encontrada", { status: 404 });
    }

    return new NextResponse(new Blob([Buffer.from(professor.foto_perfil_professor)]), {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml", // ou image/png, image/svg+xml, etc.
        "Content-Length": professor.foto_perfil_professor.length.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar foto do professor:", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { matricula: string } }
) {
  const matricula = parseInt(params.matricula);

  try {
    // Primeiro tenta no aluno
    let fotoData = await prisma.tb_aluno.findUnique({
      where: { matricula_aluno: matricula },
      select: { foto_perfil: true },
    });

    // Se não achou no aluno, tenta no professor e adapta o campo
    if (!fotoData || !fotoData.foto_perfil) {
      const professorFoto = await prisma.tb_professor.findUnique({
        where: { matricula_professor: matricula },
        select: { foto_perfil_professor: true },
      });

      if (professorFoto && professorFoto.foto_perfil_professor) {
        fotoData = { foto_perfil: professorFoto.foto_perfil_professor };
      }
    }

    if (!fotoData || !fotoData.foto_perfil) {
      return new NextResponse("Imagem não encontrada", { status: 404 });
    }

    return new NextResponse(new Blob([Buffer.from(fotoData.foto_perfil)]), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": fotoData.foto_perfil.length.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar foto:", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

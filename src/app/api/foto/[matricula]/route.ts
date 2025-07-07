import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Importe a sua instância do Prisma

export async function GET(
  req: NextRequest,
  { params }: { params: { matricula: string } }
) {
  // A verificação de 'params' é importante
  if (!params || !params.matricula) {
      return new NextResponse("Matrícula ausente na requisição", { status: 400 });
  }
  const matricula = parseInt(params.matricula);

  try {
    // Primeiro tenta no aluno
    let fotoData = await prisma.tb_aluno.findUnique({
      where: { matricula_aluno: matricula },
      select: { foto_perfil: true },
    });

    // Se não achou no aluno, tenta no professor
    if (!fotoData || !fotoData.foto_perfil) {
      const professorFoto = await prisma.tb_professor.findUnique({
        where: { matricula_professor: matricula },
        // CORREÇÃO: O nome do campo deve corresponder ao schema.prisma
        select: { foto_perfil: true },
      });

      // Adapta a estrutura para ser consistente
      if (professorFoto && professorFoto.foto_perfil) {
        fotoData = { foto_perfil: professorFoto.foto_perfil };
      }
    }

    if (!fotoData || !fotoData.foto_perfil) {
      // Retorna uma imagem de placeholder ou um 404
      return new NextResponse("Imagem não encontrada", { status: 404 });
    }

    // Retorna a imagem corretamente
    return new NextResponse(Buffer.from(fotoData.foto_perfil), {
      status: 200,
      headers: {
        "Content-Type": "image/png", // Ou o tipo de imagem que você salva
      },
    });
  } catch (error) {
    console.error("Erro ao buscar foto:", error);
    return new NextResponse("Erro interno ao buscar foto", { status: 500 });
  }
}

// app/api/foto/[matricula]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { matricula: string } }
) {
  // Validação inicial para garantir que a matrícula não é 'undefined' ou inválida
  if (!params.matricula || isNaN(parseInt(params.matricula))) {
    return new NextResponse("Matrícula inválida.", { status: 400 });
  }
  
  const matricula = parseInt(params.matricula);

  try {
    // Tenta buscar a foto no modelo de aluno
    const aluno = await prisma.tb_aluno.findUnique({
      where: { matricula_aluno: matricula },
      select: { foto_perfil: true },
    });

    // Se encontrou uma foto no aluno, retorna-a
    if (aluno && aluno.foto_perfil) {
      return new NextResponse(Buffer.from(aluno.foto_perfil), {
        status: 200,
        headers: { "Content-Type": "image/png" }, // Ou o tipo de imagem que você usa
      });
    }

    // Se não encontrou no aluno, tenta no modelo de professor
    const professor = await prisma.tb_professor.findUnique({
        where: { matricula_professor: matricula },
        select: { foto_perfil: true },
    });

    // Se encontrou uma foto no professor, retorna-a
    if (professor && professor.foto_perfil) {
        return new NextResponse(Buffer.from(professor.foto_perfil), {
            status: 200,
            headers: { "Content-Type": "image/png" },
        });
    }

    // Se não encontrou em nenhum dos dois, retorna 404 Not Found
    return new NextResponse("Imagem não encontrada para a matrícula fornecida.", { status: 404 });

  } catch (error) {
    console.error(`Erro ao buscar foto para matrícula ${matricula}:`, error);
    return new NextResponse("Erro interno ao buscar a foto.", { status: 500 });
  }
}

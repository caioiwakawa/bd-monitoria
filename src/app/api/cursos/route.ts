// app/api/cursos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Use a sua instância partilhada do Prisma

export async function GET() {
  try {
    const cursos = await prisma.tb_curso.findMany({
      select: {
        codigo_curso: true,
        nome_curso: true,
      },
      orderBy: {
        nome_curso: 'asc', // Ordenar por nome para uma melhor UX no dropdown
      },
    });
    return NextResponse.json(cursos);
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar cursos" },
      { status: 500 }
    );
  }
}

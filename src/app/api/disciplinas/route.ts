// app/api/disciplinas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Use a sua instância partilhada do Prisma

export async function GET() {
  try {
    const disciplinas = await prisma.tb_disciplina.findMany({
      orderBy: {
        nome_disciplina: 'asc',
      },
    });
    return NextResponse.json(disciplinas);
  } catch (error) {
    console.error("Erro ao buscar disciplinas:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar disciplinas" },
      { status: 500 }
    );
  }
}

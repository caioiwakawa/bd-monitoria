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
    const aluno = await prisma.tb_aluno.findUnique({
      where: { matricula_aluno: matricula },
      select: {
        matricula_aluno: true,
        nome_aluno: true,
        email_aluno: true,
        cpf_aluno: true,
        semestre_ingresso_aluno: true,
        ira: true,
        status_aluno: true,
        tb_curso_codigo_curso: true,
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

export async function UPDATE(
    req: NextRequest,
    { params }: { params: { matricula: string } }
) {
    const matricula = parseInt(params.matricula);

    const form = await req.formData();

    const file = form.get("foto_perfil") as File | null;
    let fotoBuffer: Buffer | null = null;

    if (file && file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        fotoBuffer = Buffer.from(arrayBuffer);
    }

    const cpf_aluno = form.get("cpf") as string;
    const nome_aluno = form.get("nome") as string;
    const email_aluno = form.get("email") as string;
    const semestre_ingresso_aluno = form.get("semestre") as string;
    const ira = parseFloat(form.get("ira") as string);
    const status_aluno = form.get("status") as string;
    const curso_aluno = form.get("curso") as string;

    try {
        await prisma.tb_aluno.update({
          where: { matricula_aluno: matricula },
          data: {
            nome_aluno,
            email_aluno,
            cpf_aluno,
            semestre_ingresso_aluno,
            ira,
            status_aluno,
          }
        })

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Erro ao editar aluno", error);
        return NextResponse.json({ erro: "Erro ao editar usuario" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { matricula: string } }
) {
    const matricula = parseInt(params.matricula);

    try {
        await prisma.tb_aluno_telefones.deleteMany({
          where: { tb_aluno_matricula_aluno: matricula }
        })

        await prisma.tb_aluno_elegivel.deleteMany({
          where: { tb_aluno_matricula_aluno: matricula }
        })

        await prisma.tb_aluno.delete({
            where: { matricula_aluno: matricula }
        });

        return new NextResponse("Aluno removido", { status: 200 });
    } catch (error) {
        console.error("Erro ao remover aluno:", error);  
        return new NextResponse("Erro interno", { status: 500 });      
    }
}
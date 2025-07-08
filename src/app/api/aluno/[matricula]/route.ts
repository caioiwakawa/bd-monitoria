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

export async function PUT(
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
    const telefones = form.getAll("telefones[]") as string[]

    const tb_curso_codigo_curso = parseInt(form.get("codigo_curso") as string);

    try {
        await prisma.tb_aluno.update({
          where: { matricula_aluno: matricula },
          data: {
            ...(nome_aluno && {nome_aluno}),
            ...(email_aluno && {email_aluno}),
            ...(cpf_aluno && {cpf_aluno}),
            ...(semestre_ingresso_aluno && {semestre_ingresso_aluno}),
            ...(ira && {ira}),
            ...(status_aluno && {status_aluno}),
            ...(tb_curso_codigo_curso && {tb_curso_codigo_curso})
          }
        })

        for(const item of telefones) {
          if(item === ""){ continue; }
          await prisma.tb_aluno_telefones.deleteMany({
            where: {tb_aluno_matricula_aluno: matricula}
          });
          break;
        }

        for (const numero of telefones) {
            if (numero.trim() === '') continue;

            await prisma.tb_aluno_telefones.create({
                data: {
                    num_telefone_aluno: numero,
                    tb_aluno_matricula_aluno: matricula,
                },
            });
        }

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
        });

        await prisma.tb_monitoria_tutoria.deleteMany({
          where: { matricula_aluno_monitor_tutor: matricula }
        })

        await prisma.tb_matriculado_em_disciplina.deleteMany({
          where: { tb_aluno_matricula: matricula }
        })

        await prisma.tb_cursou_disciplina.deleteMany({
          where: { tb_aluno_elegivel_tb_aluno_matricula_aluno: matricula }
        });

        await prisma.tb_avaliacao_mon_tut.deleteMany({
          where: { matricula_aluno_avaliador: matricula }
        });

        await prisma.tb_candidaturas_oferta_mon_tut.deleteMany({
          where: { tb_aluno_elegivel_tb_aluno_matricula_aluno: matricula }
        });

        await prisma.tb_aluno_matriculado.deleteMany({
          where: { tb_aluno_matricula_aluno: matricula }
        });

        await prisma.tb_aluno_elegivel.deleteMany({
          where: { tb_aluno_matricula_aluno: matricula }
        });

        await prisma.tb_aluno.delete({
            where: { matricula_aluno: matricula }
        });

        return new NextResponse("Aluno removido", { status: 200 });
    } catch (error) {
        console.error("Erro ao remover aluno:", error);  
        return new NextResponse("Erro interno", { status: 500 });      
    }
}
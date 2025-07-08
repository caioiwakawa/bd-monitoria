// app/api/professor/[matricula]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Busca os dados de um professor, incluindo telefones e cursos
export async function GET(
  req: NextRequest,
  { params }: { params: { matricula: string } }
) {
  const matricula = parseInt(params.matricula);
  if (isNaN(matricula)) {
    return NextResponse.json({ erro: "Matrícula inválida" }, { status: 400 });
  }

  try {
    const professor = await prisma.tb_professor.findUnique({
      where: { matricula_professor: matricula },
      include: {
        tb_professor_telefones: true,
        tb_curso: {
          include: {
            tb_departamento: true
          }
        }
      },
    });

    if (!professor) {
      return NextResponse.json({ erro: "Professor não encontrado" }, { status: 404 });
    }
    return NextResponse.json(professor);
  } catch (error) {
    console.error("Erro ao buscar professor:", error);
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 });
  }
}

// PUT: Atualiza os dados de um professor
export async function PUT(
    req: NextRequest,
    { params }: { params: { matricula: string } }
) {
    const matricula = parseInt(params.matricula);
    if (isNaN(matricula)) {
        return NextResponse.json({ erro: "Matrícula inválida" }, { status: 400 });
    }

    try {
        const form = await req.formData();
        const nome_professor = form.get("nome") as string;
        const email_professor = form.get("email") as string;
        const cpf_professor = form.get("cpf") as string;
        const data_contratacao_str = form.get("data contratacao") as string;
        const telefones = form.getAll("telefones[]") as string[];
        const file = form.get("foto_perfil") as File | null;

        let fotoBuffer: Buffer | undefined = undefined;
        if (file && file.size > 0) {
            fotoBuffer = Buffer.from(await file.arrayBuffer());
        }

        const dataToUpdate: any = {};
        if (nome_professor) dataToUpdate.nome_professor = nome_professor;
        if (email_professor) dataToUpdate.email_professor = email_professor;
        if (cpf_professor) dataToUpdate.cpf_professor = cpf_professor;
        if (data_contratacao_str) dataToUpdate.data_contratacao_professor = new Date(data_contratacao_str);
        if (fotoBuffer) dataToUpdate.foto_perfil = fotoBuffer;

        await prisma.$transaction(async (tx) => {
            await tx.tb_professor.update({
                where: { matricula_professor: matricula },
                data: dataToUpdate,
            });
            await tx.tb_professor_telefones.deleteMany({
                where: { tb_professor_matricula_professor: matricula },
            });
            const telefonesData = telefones
                .filter(tel => tel && tel.trim() !== '')
                .map(tel => ({ num_telefone_professor: tel, tb_professor_matricula_professor: matricula }));
            if (telefonesData.length > 0) {
                await tx.tb_professor_telefones.createMany({ data: telefonesData });
            }
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Erro ao editar professor:", error);
        return NextResponse.json({ erro: "Erro ao editar professor" }, { status: 500 });
    }
}


export async function DELETE(
    req: NextRequest,
    { params }: { params: { matricula: string } }
) {
    const matricula = parseInt(params.matricula);

    try {
        await prisma.tb_professor_telefones.deleteMany({
          where: { tb_professor_matricula_professor: matricula }
        });

        const ofertas = await prisma.tb_oferta_mon_tut.findMany({
          where: { matricula_professor_responsavel: matricula },
          select: { codigo_oferta_mon_tut: true }
        });
        
        for(const oferta of ofertas){
          await prisma.tb_candidaturas_oferta_mon_tut.deleteMany({
            where: { tb_oferta_mon_tut_codigo_oferta_mon_tut: oferta.codigo_oferta_mon_tut}
          });
        }

        await prisma.tb_oferta_mon_tut.deleteMany({
          where: { matricula_professor_responsavel: matricula }
        })

        await prisma.tb_professor.delete({
            where: { matricula_professor: matricula }
        });

        return new NextResponse("Professor removido", { status: 200 });
    } catch (error) {
        console.error("Erro ao remover professor:", error);  
        return new NextResponse("Erro interno", { status: 500 });      
    }
}
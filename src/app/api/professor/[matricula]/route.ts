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
    const professor = await prisma.tb_professor.findUnique({
      where: { matricula_professor: matricula },
      select: {
        matricula_professor: true,
        nome_professor: true,
        email_professor: true,
        cpf_professor: true,
        data_contratacao_professor: true,
        // Não incluir foto_perfil aqui!
      },
    });

    if (!professor) {
      return new NextResponse("Professor não encontrado", { status: 404 });
    }

    return NextResponse.json(professor);
  } catch (error) {
    console.error("Erro ao buscar professor:", error);
    return new NextResponse("Erro interno", { status: 500 });
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
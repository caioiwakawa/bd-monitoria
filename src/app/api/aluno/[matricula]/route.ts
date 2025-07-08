// app/api/aluno/[matricula]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Use uma instância partilhada, se tiver

// GET: Busca os dados de um aluno, incluindo curso e departamento
export async function GET(
  req: NextRequest,
  { params }: { params: { matricula: string } }
) {
  const matricula = parseInt(params.matricula);
  if (isNaN(matricula)) {
    return NextResponse.json({ erro: "Matrícula inválida" }, { status: 400 });
  }

  try {
    const aluno = await prisma.tb_aluno.findUnique({
      where: { matricula_aluno: matricula },
      include: {
        tb_curso: {
          include: {
            tb_departamento: true,
          },
        },
        tb_aluno_telefones: true,
      },
    });

    if (!aluno) {
      return NextResponse.json({ erro: "Aluno não encontrado" }, { status: 404 });
    }
    return NextResponse.json(aluno);
  } catch (error) {
    console.error("Erro ao buscar aluno:", error);
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 });
  }
}

// PUT: Atualiza os dados de um aluno (compatível com o seu EditModal)
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
    const nome_aluno = form.get("nome") as string;
    const email_aluno = form.get("email") as string;
    const cpf_aluno = form.get("cpf") as string;
    const semestre_ingresso_aluno = form.get("semestre") as string;
    const iraStr = form.get("ira") as string;
    const status_aluno = form.get("status") as string;
    const codigoCursoStr = form.get("codigo_curso") as string;
    const telefones = form.getAll("telefones[]") as string[];
    const file = form.get("foto_perfil") as File | null;

    let fotoBuffer: Buffer | undefined = undefined;
    if (file && file.size > 0) {
      fotoBuffer = Buffer.from(await file.arrayBuffer());
    }
    
    // Objeto para guardar apenas os campos que serão atualizados
    const dataToUpdate: any = {};
    if (nome_aluno) dataToUpdate.nome_aluno = nome_aluno;
    if (email_aluno) dataToUpdate.email_aluno = email_aluno;
    if (cpf_aluno) dataToUpdate.cpf_aluno = cpf_aluno;
    if (semestre_ingresso_aluno) dataToUpdate.semestre_ingresso_aluno = semestre_ingresso_aluno;
    if (iraStr) dataToUpdate.ira = parseFloat(iraStr);
    if (status_aluno) dataToUpdate.status_aluno = status_aluno;
    if (codigoCursoStr) dataToUpdate.tb_curso_codigo_curso = parseInt(codigoCursoStr);
    if (fotoBuffer) dataToUpdate.foto_perfil = fotoBuffer;


    // Usamos uma transação para garantir a consistência dos dados
    await prisma.$transaction(async (tx) => {
      await tx.tb_aluno.update({
        where: { matricula_aluno: matricula },
        data: dataToUpdate,
      });

      // Apaga TODOS os telefones antigos do aluno e insere os novos
      await tx.tb_aluno_telefones.deleteMany({
        where: { tb_aluno_matricula_aluno: matricula },
      });

      const telefonesData = telefones
        .filter(tel => tel && tel.trim() !== '')
        .map(tel => ({
          num_telefone_aluno: tel,
          tb_aluno_matricula_aluno: matricula,
        }));

      if (telefonesData.length > 0) {
        await tx.tb_aluno_telefones.createMany({
          data: telefonesData,
        });
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao editar aluno:", error);
    return NextResponse.json({ erro: "Erro ao editar usuário" }, { status: 500 });
  }
}

// A sua função DELETE pode permanecer como está
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

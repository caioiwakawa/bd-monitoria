import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Importe a sua instância do Prisma

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const file = form.get("foto_perfil") as File | null;
  let fotoBuffer: Buffer | null = null;

  if (file && file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    fotoBuffer = Buffer.from(arrayBuffer);
  }

  const matricula_professor = parseInt(form.get("matricula") as string);
  const nome_professor = form.get("nome") as string;
  const email_professor = form.get("email") as string;
  const cpf_professor = form.get("cpf") as string;
  const data_contratacao_str = form.get("data contratacao") as string;
  const telefones = form.getAll('telefones[]') as string[];
  
  // Lógica de data melhorada para evitar erros
  let data_contratacao_professor: Date;
  if (data_contratacao_str) {
      data_contratacao_professor = new Date(data_contratacao_str.split('-').reverse().join('-'));
  } else {
      data_contratacao_professor = new Date(); // Ou trate como um erro se for obrigatório
  }


  try {
    const professor = await prisma.tb_professor.create({
      data: {
        matricula_professor,
        nome_professor,
        email_professor,
        cpf_professor,
        data_contratacao_professor,
        // CORREÇÃO: O nome do campo deve corresponder ao schema.prisma
        foto_perfil: fotoBuffer,
      },
    });
    
    // Inserir telefones se existirem
    if (telefones && telefones.length > 0) {
        for (const numero of telefones) {
            if (numero.trim() === '') continue;
            await prisma.tb_professor_telefones.create({
              data: {
                num_telefone_professor: numero,
                tb_professor_matricula_professor: matricula_professor,
              },
            });
        }
    }

    return NextResponse.json({ ok: true, professor });
  } catch (error) {
    console.error("Erro ao cadastrar professor:", error);
    return NextResponse.json({ erro: "Erro ao cadastrar professor" }, { status: 500 });
  }
}

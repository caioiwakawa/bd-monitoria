import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Use a sua instância partilhada do Prisma

export async function POST(req: NextRequest) {
  const form = await req.formData();
  // ... (código para foto, etc. permanece igual) ...
  const file = form.get("foto_perfil") as File | null;

  let fotoBuffer: Buffer | null = null;
  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    fotoBuffer = Buffer.from(arrayBuffer);
  }

  // Obter todos os dados do formulário
  const matricula_aluno = parseInt(form.get("matricula") as string);
  const nome_aluno = form.get("nome") as string;
  const email_aluno = form.get("email") as string;
  const cpf_aluno = form.get("cpf") as string;
  const semestre_ingresso_aluno = form.get("semestre") as string;
  const ira = parseFloat(form.get("ira") as string);
  const status_aluno = form.get("status") as string;
  
  // MUDANÇA PRINCIPAL: Recebemos o código do curso diretamente
  const codigo_curso = parseInt(form.get("codigo_curso") as string);

  const telefones = form.getAll("telefones[]") as string[];
  const disciplinasCursadas = form.getAll("disciplinas_cursadas[]") as string[];
  const disciplinasCursando = form.getAll("disciplinas_cursando[]") as string[];

  // Validação para garantir que o código do curso foi enviado
  if (isNaN(codigo_curso)) {
      return NextResponse.json({ erro: "Curso inválido ou não selecionado." }, { status: 400 });
  }

  try {
    // A busca pelo nome do curso não é mais necessária!
    // const curso = await prisma.tb_curso.findFirst(...);

    const aluno = await prisma.$transaction(async (tx) => {
      const novoAluno = await tx.tb_aluno.create({
        data: {
          matricula_aluno,
          nome_aluno,
          email_aluno,
          cpf_aluno,
          semestre_ingresso_aluno,
          ira,
          status_aluno,
          // Usamos o código do curso recebido diretamente do formulário
          tb_curso_codigo_curso: codigo_curso,
          foto_perfil: fotoBuffer,
        },
      });

      // ... (o resto da lógica da transação para telefones e disciplinas permanece igual) ...
      if (telefones && telefones.length > 0) {
        for (const numero of telefones) {
          if (numero.trim()) {
            await tx.tb_aluno_telefones.create({
              data: { num_telefone_aluno: numero, tb_aluno_matricula_aluno: matricula_aluno },
            });
          }
        }
      }

      await tx.tb_aluno_elegivel.create({ data: { tb_aluno_matricula_aluno: matricula_aluno } });
      await tx.tb_aluno_matriculado.create({ data: { tb_aluno_matricula_aluno: matricula_aluno } });

      if (disciplinasCursadas && disciplinasCursadas.length > 0) {
        for (const codigoDisciplina of disciplinasCursadas) {
          await tx.tb_cursou_disciplina.create({
            data: {
              tb_disciplina_codigo_disciplina: codigoDisciplina,
              tb_aluno_elegivel_tb_aluno_matricula_aluno: matricula_aluno,
              semestre_aprovacao: "N/I",
            },
          });
        }
      }

      if (disciplinasCursando && disciplinasCursando.length > 0) {
        for (const codigoDisciplina of disciplinasCursando) {
          const turmaDisponivel = await tx.tb_turma.findFirst({
            where: { tb_disciplina_codigo_disciplina: codigoDisciplina },
          });
          if (turmaDisponivel) {
            await tx.tb_matriculado_em_disciplina.create({
              data: {
                tb_aluno_matricula: matricula_aluno,
                tb_turma_codigo_disciplina: turmaDisponivel.tb_disciplina_codigo_disciplina,
                tb_turma_numero_turma: turmaDisponivel.numero_turma,
                tb_turma_semestre_turma: turmaDisponivel.semestre_turma,
              },
            });
          }
        }
      }

      return novoAluno;
    });

    return NextResponse.json({ ok: true, aluno });
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    return NextResponse.json({ erro: "Erro ao cadastrar aluno" }, { status: 500 });
  }
}

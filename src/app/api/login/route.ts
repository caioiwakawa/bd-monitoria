import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const matricula = parseInt(form.get("matricula") as string);
    const cpf = form.get("cpf") as string;
    console.log("Recebido CPF:", cpf);
    console.log("Matrícula:", matricula);

    try {
        // Verificar aluno
        const aluno = await prisma.tb_aluno.findUnique({ where: { matricula_aluno: matricula } });
        if (aluno && aluno.cpf_aluno === cpf) {
            return NextResponse.json({ tipo: "aluno", matricula });
        }

        // Verificar professor
        const professor = await prisma.tb_professor.findUnique({ where: { matricula_professor: matricula } });
        console.log("Professor encontrado:", professor);
        if (professor && professor.cpf_professor === cpf) {
            return NextResponse.json({ tipo: "professor", matricula });
        }
        

        return NextResponse.json({ erro: "Credenciais inválidas" }, { status: 401 });

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
    }
}

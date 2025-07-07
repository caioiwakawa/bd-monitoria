import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

//EU NÃO FAÇO IDEIA SE ISSO FUNCIONA OU NÃO
const prisma = new PrismaClient();

export async function POST(request: Request){
    try
    {
        const { matricula_aluno, codigo_oferta_mon_tut } = await request.json()

        if (!matricula_aluno || !codigo_oferta_mon_tut ) {
        return NextResponse.json(
            { error: 'matricula_aluno E codigo_oferta_mon_tut são obrigatórios.' },
            { status: 400 }
        )
        }

        //Verifica se o aluno se inscreveu para a oferta
        const alunoSelecionado = await prisma.tb_candidaturas_oferta_mon_tut.findUnique({
        where: {
            tb_aluno_elegivel_tb_aluno_matricula_aluno_tb_oferta_mon_tut_codigo_oferta: {
                tb_aluno_elegivel_tb_aluno_matricula_aluno: matricula_aluno,
                tb_oferta_mon_tut_codigo_oferta_mon_tut: codigo_oferta_mon_tut,
            }
        },
        })

        if (!alunoSelecionado) {
            return NextResponse.json(
            { error: 'Aluno não se inscreveu para a vaga.' },
            { status: 403 }
        )
        }

        const form = await request.formData();
        const horario_mon_tut = form.get("horario") as string;
        //HORÁRIO DE MONITORIA NÃO PODE SER NULO, TEM QUE CRIAR UM ERRO CASO O USUÁRIO NÃO PREENCHA ESSA INFORMAÇÃO

        const novaMonitoria = await prisma.tb_candidaturas_oferta_mon_tut.create({
        data: {
            tb_oferta_mon_tut_codigo_oferta_mon_tut: codigo_oferta_mon_tut,
            tb_aluno_elegivel_tb_aluno_matricula_aluno: matricula_aluno,
            horario_mon_tut,
        },
        })

    } catch (error) {
    console.error('Erro ao inscrever na monitoria:', error)
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 })
  }
}
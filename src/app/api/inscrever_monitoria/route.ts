// /api/inscrever_monitoria/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/prisma'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { matricula_aluno, codigo_oferta_mon_tut } = await req.json()

    if (!matricula_aluno || !codigo_oferta_mon_tut) {
      return NextResponse.json(
        { error: 'matricula_aluno e codigo_oferta_mon_tut são obrigatórios.' },
        { status: 400 }
      )
    }

    // Verifica se o aluno é elegível
    const alunoElegivel = await prisma.tb_aluno_elegivel.findUnique({
      where: {
        tb_aluno_matricula_aluno: matricula_aluno,
      },
    })

    if (!alunoElegivel) {
      return NextResponse.json(
        { error: 'Aluno não é elegível para se inscrever.' },
        { status: 403 }
      )
    }

    // Verifica se já existe inscrição
    const inscricaoExistente = await prisma.tb_candidaturas_oferta_mon_tut.findUnique({
    where: {
            tb_aluno_elegivel_tb_aluno_matricula_aluno_tb_oferta_mon_tut_codigo_oferta_mon_tut: {
            tb_aluno_elegivel_tb_aluno_matricula_aluno: matricula_aluno,
            tb_oferta_mon_tut_codigo_oferta_mon_tut: codigo_oferta_mon_tut,
            },
        },
    });

    if (inscricaoExistente) {
      return NextResponse.json(
        { error: 'Aluno já está inscrito nesta oferta.' },
        { status: 409 }
      )
    }

    // Realiza a inscrição
    const novaInscricao = await prisma.tb_candidaturas_oferta_mon_tut.create({
      data: {
        tb_aluno_elegivel_tb_aluno_matricula_aluno: matricula_aluno,
        tb_oferta_mon_tut_codigo_oferta_mon_tut: codigo_oferta_mon_tut,
      },
    })

    return NextResponse.json(novaInscricao, { status: 201 })

  } catch (error) {
    console.error('Erro ao inscrever na monitoria:', error)
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 })
  }
}

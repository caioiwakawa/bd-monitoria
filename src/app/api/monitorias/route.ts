import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const ofertas = await prisma.tb_oferta_mon_tut.findMany({
    include: {
      tb_ofertas_e_turmas: {
        include: {
          tb_turma: {
            include: {
              tb_disciplina: true,
            },
          },
        },
      },
    },
  });

  const resultado = ofertas.map((oferta: { tb_ofertas_e_turmas: { tb_turma: any; }[]; codigo_oferta_mon_tut: any; tipo_oferta: any; desc_oferta: any; carga_horaria_oferta: any; bolsa_oferta: any; }) => {
    const turma = oferta.tb_ofertas_e_turmas[0]?.tb_turma;
    const disciplina = turma?.tb_disciplina;

    return {
      codigoOferta: oferta.codigo_oferta_mon_tut,
      tipo: oferta.tipo_oferta,
      descricao: oferta.desc_oferta,
      cargaHoraria: oferta.carga_horaria_oferta,
      bolsa: oferta.bolsa_oferta,
      nomeDisciplina: disciplina
        ? `${disciplina.codigo_disciplina} ${disciplina.codigo_departamento} - ${disciplina.nome_disciplina}`
        : 'Disciplina não encontrada',
    };
  });

  return NextResponse.json(resultado);
}

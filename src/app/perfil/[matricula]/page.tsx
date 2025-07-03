"use client";

import { useEffect, useState } from "react";

interface Aluno {
  matricula_aluno: number;
  nome_aluno: string;
  email_aluno: string;
  cpf_aluno: string;
  semestre_ingresso_aluno: string;
  ira: number;
  status_aluno: string;
  codigo_curso: number;
}

interface PerfilAlunoProps {
  params: { matricula: string };
}

export default function PerfilAluno({ params }: PerfilAlunoProps) {
  const { matricula } = params;
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAluno() {
      try {
        const res = await fetch(`/api/aluno/${matricula}`);
        if (!res.ok) {
          setErro("Aluno não encontrado");
          return;
        }
        const data: Aluno = await res.json();
        setAluno(data);
      } catch {
        setErro("Erro ao buscar dados do aluno");
      }
    }

    fetchAluno();
  }, [matricula]);

  if (erro) return <p>{erro}</p>;
  if (!aluno) return <p>Carregando...</p>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Perfil do Aluno: {aluno.nome_aluno}</h1>

      <div style={{ marginBottom: 20 }}>
        <img
          src={`/api/foto/${matricula}`} // imagem SVG direta do backend
          alt="Foto do aluno"
          width={160}
          height={160}
          style={{ borderRadius: 8, objectFit: "cover", border: "1px solid #ccc" }}
        />
      </div>

      <ul>
        <li><strong>Matrícula:</strong> {aluno.matricula_aluno}</li>
        <li><strong>E-mail:</strong> {aluno.email_aluno}</li>
        <li><strong>CPF:</strong> {aluno.cpf_aluno}</li>
        <li><strong>Semestre de Ingresso:</strong> {aluno.semestre_ingresso_aluno}</li>
        <li><strong>IRA:</strong> {aluno.ira}</li>
        <li><strong>Status:</strong> {aluno.status_aluno}</li>
        <li><strong>Código do Curso:</strong> {aluno.codigo_curso}</li>
      </ul>
    </main>
  );
}

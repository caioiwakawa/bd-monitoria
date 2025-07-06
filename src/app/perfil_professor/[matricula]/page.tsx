"use client";

import { useEffect, useState } from "react";

interface Professor {
  matricula_professor: number;
  nome_professor: string;
  email_professor: string;
  cpf_professor: string;
  data_contratacao_professor: string; // ou Date, dependendo do seu parse
}

interface PerfilProfessorProps {
  params: { matricula: string };
}

export default function PerfilProfessor({ params }: PerfilProfessorProps) {
  const { matricula } = params;
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfessor() {
      try {
        const res = await fetch(`/api/professor/${matricula}`);
        if (!res.ok) {
          setErro("Professor não encontrado");
          return;
        }
        const data: Professor = await res.json();
        setProfessor(data);
      } catch {
        setErro("Erro ao buscar dados do professor");
      }
    }

    fetchProfessor();
  }, [matricula]);

  if (erro) return <p>{erro}</p>;
  if (!professor) return <p>Carregando...</p>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Perfil do Professor: {professor.nome_professor}</h1>

      <div style={{ marginBottom: 20 }}>
        <img
          src={`/api/foto/${matricula}`}
          alt="Foto do professor"
          width={160}
          height={160}
          style={{ borderRadius: 8, objectFit: "cover", border: "1px solid #ccc" }}
        />
      </div>

      <ul>
        <li><strong>Matrícula:</strong> {professor.matricula_professor}</li>
        <li><strong>E-mail:</strong> {professor.email_professor}</li>
        <li><strong>CPF:</strong> {professor.cpf_professor}</li>
        <li><strong>Data de Contratação:</strong> {new Date(professor.data_contratacao_professor).toLocaleDateString()}</li>
      </ul>
    </main>
  );
}

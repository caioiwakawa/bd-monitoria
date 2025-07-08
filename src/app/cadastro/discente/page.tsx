"use client";
import LoginHeader from "@/components/login_header";
import FormBox from "@/components/form_box";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Curso, Disciplina } from "@/lib/type";

function TelefoneInput({ index }: { index: number }) {
  return <FormBox name={`telefones[]`} placeholder={`Telefone ${index + 1}`} />;
}

export default function CadastroDiscente() {
  // Novos estados para os dados dinâmicos
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [disciplinasCursadas, setDisciplinasCursadas] = useState<Set<string>>(new Set());
  const [disciplinasCursando, setDisciplinasCursando] = useState<Set<string>>(new Set());

  // Efeito para buscar os dados quando o componente carrega
  useEffect(() => {
    async function fetchData() {
      const [cursosRes, disciplinasRes] = await Promise.all([
        fetch("/api/cursos"),
        fetch("/api/disciplinas"),
      ]);
      if (cursosRes.ok) setCursos(await cursosRes.json());
      if (disciplinasRes.ok) setDisciplinas(await disciplinasRes.json());
    }
    fetchData();
  }, []);

  // ... (funções handleCheckboxChange e handleSubmit permanecem as mesmas da resposta anterior) ...
  const handleCheckboxChange = (
    codigo: string,
    tipo: "cursadas" | "cursando"
  ) => {
    if (tipo === "cursadas") {
      setDisciplinasCursadas((prev) => {
        const novoSet = new Set(prev);
        if (novoSet.has(codigo)) novoSet.delete(codigo);
        else novoSet.add(codigo);
        return novoSet;
      });
    } else {
      setDisciplinasCursando((prev) => {
        const novoSet = new Set(prev);
        if (novoSet.has(codigo)) novoSet.delete(codigo);
        else novoSet.add(codigo);
        return novoSet;
      });
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    disciplinasCursadas.forEach((codigo) => formData.append("disciplinas_cursadas[]", codigo));
    disciplinasCursando.forEach((codigo) => formData.append("disciplinas_cursando[]", codigo));

    const res = await fetch("/api/cadastrar_discente", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Aluno cadastrado com sucesso!");
      window.location.href = "/";
    } else {
      const data = await res.json();
      alert(`Erro ao cadastrar aluno: ${data.erro || 'Erro desconhecido'}`);
    }
  }

  const [telefonesCount, setTelefonesCount] = useState(1);
  function adicionarTelefone() {
    setTelefonesCount((prev) => prev + 1);
  }

  return (
    <main>
      <LoginHeader />
      <div className="relative mx-auto my-20 w-132 bg-unblightblue border-2 border-unbblue rounded-4xl pb-10">
        <h1 className="text-center my-7 text-4xl font-medium w-full">
          Cadastro de Aluno
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Campos existentes */}
          <div className="relative w-92 h-20 mx-20 my-10">
            <label className="text-xl">Foto de Perfil:</label>
            <input type="file" name="foto_perfil" accept="image/*" className="block mt-2" required />
          </div>
          <FormBox name="nome" placeholder="Nome Completo" />
          <FormBox name="matricula" placeholder="Matrícula" />
          <FormBox name="email" placeholder="E-mail" />
          <FormBox name="cpf" placeholder="CPF" />
          <FormBox name="semestre" placeholder="Semestre de Ingresso (ex: 2024.1)" />
          <FormBox name="ira" placeholder="IRA" />
          <FormBox name="status" placeholder="Status (ex: Ativo)" />

          {/* CAMPO DE CURSO SUBSTITUÍDO POR UM DROPDOWN */}
          <div className="relative w-92 h-20 mx-20 my-10">
            <select
              name="codigo_curso" // O nome agora é o código, não o nome do curso
              className="w-full h-full px-8 bg-white rounded-2xl text-2xl"
              required
              defaultValue=""
            >
              <option value="" disabled>Selecione seu curso</option>
              {cursos.map((curso) => (
                <option key={curso.codigo_curso} value={curso.codigo_curso}>
                  {curso.nome_curso}
                </option>
              ))}
            </select>
          </div>

          {/* O resto do formulário continua igual... */}
          <div id="telefones-wrapper">
            {Array.from({ length: telefonesCount }).map((_, index) => (
              <TelefoneInput key={index} index={index} />
            ))}
          </div>
          <button type="button" onClick={adicionarTelefone} className="ml-20 mb-4 text-lg text-unbblue underline">
            + Adicionar outro telefone
          </button>
          
          <div className="mx-20 my-10">
            <h2 className="text-2xl font-semibold mb-4">Disciplinas que você já cursou</h2>
            <div className="h-48 overflow-y-auto bg-white p-4 rounded-lg border">
              {disciplinas.map((d) => (
                <div key={`cursada-${d.codigo_disciplina}`} className="flex items-center mb-2">
                  <input type="checkbox" id={`cursada-${d.codigo_disciplina}`} onChange={() => handleCheckboxChange(d.codigo_disciplina, "cursadas")} className="h-5 w-5"/>
                  <label htmlFor={`cursada-${d.codigo_disciplina}`} className="ml-3 text-lg">{d.nome_disciplina} ({d.codigo_disciplina})</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mx-20 my-10">
            <h2 className="text-2xl font-semibold mb-4">Disciplinas que você está cursando</h2>
            <div className="h-48 overflow-y-auto bg-white p-4 rounded-lg border">
              {disciplinas.map((d) => (
                <div key={`cursando-${d.codigo_disciplina}`} className="flex items-center mb-2">
                  <input type="checkbox" id={`cursando-${d.codigo_disciplina}`} onChange={() => handleCheckboxChange(d.codigo_disciplina, "cursando")} className="h-5 w-5"/>
                  <label htmlFor={`cursando-${d.codigo_disciplina}`} className="ml-3 text-lg">{d.nome_disciplina} ({d.codigo_disciplina})</label>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-40 h-20 mx-auto block mb-5 bg-unbblue rounded-3xl border-1 border-black text-2xl text-white">
            Criar Conta
          </button>
          <Link href="/">
            <h1 className="text-center my-5">Já tem uma conta? Faça o login</h1>
          </Link>
        </form>
      </div>
      <div className="relative top-5 w-screen h-24 bg-unbblue"></div>
    </main>
  );
}

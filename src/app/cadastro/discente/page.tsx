"use client";
import LoginHeader from "@/components/login_header";
import FormBox from "@/components/form_box";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Curso, Disciplina } from "@/lib/type";

function TelefoneInput({ index }: { index: number }) {
  return <FormBox name={`telefones[]`} placeholder={`Telefone ${index + 1} (Opcional)`} required={false} />;
}

export default function CadastroDiscente() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [disciplinasCursadas, setDisciplinasCursadas] = useState<Set<string>>(new Set());
  const [disciplinasCursando, setDisciplinasCursando] = useState<Set<string>>(new Set());
  
  // Estados de feedback
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCheckboxChange = (codigo: string, tipo: "cursadas" | "cursando") => {
    const setter = tipo === "cursadas" ? setDisciplinasCursadas : setDisciplinasCursando;
    setter((prev) => {
      const novoSet = new Set(prev);
      if (novoSet.has(codigo)) novoSet.delete(codigo);
      else novoSet.add(codigo);
      return novoSet;
    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMensagem(null);

    const formData = new FormData(event.currentTarget);
    disciplinasCursadas.forEach((codigo) => formData.append("disciplinas_cursadas[]", codigo));
    disciplinasCursando.forEach((codigo) => formData.append("disciplinas_cursando[]", codigo));

    const res = await fetch("/api/cadastrar_discente", {
      method: "POST",
      body: formData,
    });
    
    const data = await res.json();

    if (res.ok) {
      setMensagem({ texto: "Aluno cadastrado com sucesso! A redirecionar...", tipo: 'sucesso' });
      setTimeout(() => { window.location.href = "/"; }, 2000);
    } else {
      setMensagem({ texto: `Erro: ${data.erro || 'Não foi possível efetuar o cadastro.'}`, tipo: 'erro' });
    }
    setIsLoading(false);
  }

  const [telefonesCount, setTelefonesCount] = useState(1);
  function adicionarTelefone() {
    setTelefonesCount((prev) => prev + 1);
  }

  return (
    <main>
      <LoginHeader />
      <div className="relative mx-auto my-20 w-132 bg-unblightblue border-2 border-unbblue rounded-4xl pb-10">
        <h1 className="text-center my-7 text-4xl font-medium w-full">Cadastro de Aluno</h1>
        <form onSubmit={handleSubmit}>
          <div className="relative w-92 h-20 mx-20 my-10">
            <label className="text-xl">Foto de Perfil:</label>
            <input type="file" name="foto_perfil" accept="image/*" className="block mt-2" required />
          </div>
          <FormBox name="nome" placeholder="Nome Completo" />
          <FormBox name="matricula" placeholder="Matrícula" type="number" />
          <FormBox name="email" placeholder="E-mail" type="email" />
          <FormBox name="cpf" placeholder="CPF" />
          <FormBox name="semestre" placeholder="Semestre de Ingresso (ex: 2024.1)" />
          <FormBox name="ira" placeholder="IRA" type="number" />
          <FormBox name="status" placeholder="Status (ex: Ativo)" />

          <div className="relative w-92 h-20 mx-20 my-10">
            <select name="codigo_curso" className="w-full h-full px-8 bg-white rounded-2xl text-2xl" required defaultValue="">
              <option value="" disabled>Selecione seu curso</option>
              {cursos.map((curso) => (
                <option key={curso.codigo_curso} value={curso.codigo_curso}>{curso.nome_curso}</option>
              ))}
            </select>
          </div>

          <div id="telefones-wrapper">
            {Array.from({ length: telefonesCount }).map((_, index) => (
              <TelefoneInput key={index} index={index} />
            ))}
          </div>
          <button type="button" onClick={adicionarTelefone} className="ml-20 mb-4 text-lg text-unbblue underline">
            + Adicionar outro telefone
          </button>
          
          <div className="mx-20 my-10">
            <h2 className="text-2xl font-semibold mb-4">Disciplinas que já cursou</h2>
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
            <h2 className="text-2xl font-semibold mb-4">Disciplinas que está a cursar</h2>
            <div className="h-48 overflow-y-auto bg-white p-4 rounded-lg border">
              {disciplinas.map((d) => (
                <div key={`cursando-${d.codigo_disciplina}`} className="flex items-center mb-2">
                  <input type="checkbox" id={`cursando-${d.codigo_disciplina}`} onChange={() => handleCheckboxChange(d.codigo_disciplina, "cursando")} className="h-5 w-5"/>
                  <label htmlFor={`cursando-${d.codigo_disciplina}`} className="ml-3 text-lg">{d.nome_disciplina} ({d.codigo_disciplina})</label>
                </div>
              ))}
            </div>
          </div>

          {mensagem && (
            <div className={`w-92 mx-20 p-3 rounded-lg text-center text-white ${mensagem.tipo === 'sucesso' ? 'bg-green-600' : 'bg-red-600'}`}>
              {mensagem.texto}
            </div>
          )}

          <button type="submit" className="w-40 h-20 mx-auto block mt-5 mb-5 bg-unbblue rounded-3xl border-1 border-black text-2xl text-white disabled:bg-gray-500" disabled={isLoading}>
            {isLoading ? 'Aguarde...' : 'Criar Conta'}
          </button>
          <Link href="/">
            <h1 className="text-center my-5">Já tem uma conta? Faça o login</h1>
          </Link>
        </form>
      </div>
    </main>
  );
}

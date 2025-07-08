"use client"
import LoginHeader from "@/components/login_header";
import FormBox from "@/components/form_box";
import Link from "next/link";
import { useState } from "react";

function TelefoneInput({ index }: { index: number }) {
  return (
    <FormBox
      name={`telefones[]`}
      placeholder={`Telefone ${index + 1} (Opcional)`}
      required={false} // Usando a nova prop 'required'
    />
  );
}

export default function CadastroDocente() {
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMensagem(null);

    const formData = new FormData(event.currentTarget);

    const res = await fetch('/api/cadastrar_docente', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setMensagem({ texto: 'Professor cadastrado com sucesso! A redirecionar...', tipo: 'sucesso' });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } else {
      setMensagem({ texto: `Erro: ${data.erro || 'Não foi possível efetuar o cadastro.'}`, tipo: 'erro' });
    }
    setIsLoading(false);
  }

  const [telefonesCount, setTelefonesCount] = useState(1);
  function adicionarTelefone() {
    setTelefonesCount(prev => prev + 1);
  }

  return (
    <main>
      <LoginHeader/>
      <div className="relative mx-auto top-20 w-132 h-auto pb-10 bg-unblightblue border-2 border-unbblue rounded-4xl">
        <h1 className="text-center my-7 text-4xl font-medium w-full">Cadastro de Docente</h1>
        <form onSubmit={handleSubmit}>
          <div className="relative w-92 h-20 mx-20 my-10">
            <label className="text-xl">Foto de Perfil (Opcional):</label>
            <input 
              type="file" 
              name="foto_perfil" 
              accept="image/*" 
              className="block mt-2"
            />
          </div>
          <FormBox name="nome" placeholder="Nome Completo" />
          <FormBox name="matricula" placeholder="Matrícula" type="number" />
          <FormBox name="email" placeholder="E-mail" type="email" />
          <FormBox name="cpf" placeholder="CPF" />
          
          <div className="relative w-92 h-20 mx-20 my-10">
            <label className="block text-xl mb-2">Data de Contratação</label>
            <input
              type="date"
              name="data_contratacao"
              className="w-full h-full px-8 bg-white rounded-2xl text-2xl"
              required
            />
          </div>

          <div id="telefones-wrapper">
            {Array.from({ length: telefonesCount }).map((_, index) => (
              <TelefoneInput key={index} index={index} />
            ))}
          </div>
          <button
            type="button"
            onClick={adicionarTelefone}
            className="ml-20 mb-4 text-lg text-unbblue underline"
          >
            + Adicionar outro telefone
          </button>

          {mensagem && (
            <div className={`w-92 mx-20 p-3 rounded-lg text-center text-white ${mensagem.tipo === 'sucesso' ? 'bg-green-600' : 'bg-red-600'}`}>
              {mensagem.texto}
            </div>
          )}

          <button 
            type="submit" 
            className="w-40 h-20 mx-auto mt-5 block bg-unbblue rounded-3xl border-1 border-black text-2xl text-white disabled:bg-gray-500"
            disabled={isLoading}
          >
            {isLoading ? 'Aguarde...' : 'Criar Conta'}
          </button>
          <Link href="/"><h1 className="text-center text-white my-5">Já tem uma conta? Faça o login</h1></Link>
        </form>
      </div>
    </main>
  );
}

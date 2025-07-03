"use client"
import LoginHeader from "@/components/login_header";
import FormBox from "@/components/form_box";
import Link from "next/link";

import { useState } from "react";

// Fora do componente
function TelefoneInput({ index }: { index: number }) {
  return (
    <FormBox
      name={`telefones[]`}
      placeholder={`Telefone ${index + 1}`}
    />
  );
}

export default function CadastroDiscente() {
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const res = await fetch('/api/cadastrar_discente', {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            alert('Aluno cadastrado com sucesso!');
            // redirecionar ou limpar formulário se quiser
        } else {
            alert('Erro ao cadastrar aluno');
        }
    }


    const [telefonesCount, setTelefonesCount] = useState(1); // começa com 1 campo

    function adicionarTelefone() {
        setTelefonesCount(prev => prev + 1); // adiciona mais um campo de telefone
    }

    return (
        <main>
            <LoginHeader/>
            <div className="relative mx-auto top-20 w-132 h-380 bg-unblightblue border-2 border-unbblue rounded-4xl">
                <h1 className="text-center my-7 text-4xl font-medium w-full">Cadastro</h1>
                <form onSubmit={handleSubmit}>
                    <FormBox name="nome" placeholder="Nome" />
                    <FormBox name="matricula" placeholder="Matrícula" />
                    <FormBox name="email" placeholder="E-mail" />
                    <FormBox name="cpf" placeholder="CPF" />
                    <div className="relative w-92 h-20 mx-20 my-10">
                        <label className="text-xl text-white">Foto de Perfil:</label>
                        <input 
                            type="file" 
                            name="foto_perfil" 
                            accept="image/*" 
                            className="block mt-2 text-white"
                            required
                        />
                    </div>
                    <FormBox name="semestre" placeholder="Semestre de Ingresso" />
                    <FormBox name="ira" placeholder="IRA" />
                    <FormBox name="status" placeholder="Status" />
                    <FormBox name="curso" placeholder="Curso" />

                    {/* Telefones dinâmicos */}
                    <div id="telefones-wrapper" className="">
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

                    <button type="submit" className="w-40 h-20 mx-46 mb-5 bg-unbblue rounded-3xl border-1 border-black text-2xl text-white">Criar Conta</button>
                    <Link href="/"><h1 className="text-center text-white my-5">Já tem uma conta? Faça o login</h1></Link>
                </form>
            </div>
            <div className="absolute top-440 w-screen h-24 bg-unbblue"></div>
        </main>
    )
}

'use client'

import Image from "next/image";
import { useState } from "react";
import { Professor } from "@/lib/type";

// Componente para o telefone, para manter o código limpo
function TelefoneInput({ defaultValue, index }: { defaultValue: string, index: number }) {
    return (
        <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
            <input name={`telefones[]`} placeholder={`Telefone ${index + 1}`} className="text-2xl p-5 bg-transparent w-full h-full" defaultValue={defaultValue} />
        </div>
    )
}

// Interface de props específica para este modal, que espera um 'professor'
interface EditModalDocenteProps {
    setEdit: (value: boolean) => void;
    matricula: string;
    professor: Professor;
}

export default function EditModalDocente({ setEdit, matricula, professor }: EditModalDocenteProps) {
    
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        // A chamada à API agora aponta para a rota de professores
        const res = await fetch(`/api/professor/${matricula}`, {
            method: "PUT",
            body: formData,
        });

        if (res.ok) {
            alert("Professor editado com sucesso!");
            window.location.reload(); // Recarrega a página para ver as alterações
        } else {
            const data = await res.json();
            alert(`Erro ao editar professor: ${data.erro || 'Erro desconhecido'}`);
        }
    }

    // O estado agora é inicializado com os telefones do professor
    const [telefones, setTelefones] = useState(professor.tb_professor_telefones.map(t => t.num_telefone_professor));
    
    const adicionarTelefone = () => {
        setTelefones(prev => [...prev, ""]);
    };

    return (
        <>
        <div className="fixed w-screen h-screen top-0 left-0 z-10 opacity-50 bg-white"></div>
        <div className="absolute w-132 h-auto z-20 top-30 left-1/2 -ml-66 rounded-4xl bg-gray-100 border-2 border-unbblue">
            <button onClick={() => setEdit(false)} className="absolute top-7 right-7 w-14 h-14"><Image src="/exit.png" alt="Sair" fill/></button>
            <div className="relative w-38 h-38 mx-auto top-7">
                <Image src={`/api/foto/${matricula}` || "/perfil_generico.png"} alt="Foto de Perfil" fill className="rounded-full object-cover"/>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="relative w-16 h-16 -top-4 mx-auto">
                    <input type="file" name="foto_perfil" accept="image/*" className="w-16 h-16 z-30 text-white"/> 
                </div>
                {/* OS CAMPOS AGORA USAM OS DADOS DO PROFESSOR */}
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="nome" placeholder="Nome" className="text-2xl p-5 bg-transparent w-full" defaultValue={professor.nome_professor}></input>
                </div>
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="email" placeholder="E-mail" className="text-2xl p-5 bg-transparent w-full" defaultValue={professor.email_professor}></input>
                </div>
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="cpf" placeholder="CPF" className="text-2xl p-5 bg-transparent w-full" defaultValue={professor.cpf_professor}></input>
                </div>
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="data contratacao" placeholder="Data de Ingresso" type="date" className="text-2xl p-5 bg-transparent w-full" defaultValue={new Date(professor.data_contratacao_professor).toISOString().split('T')[0]}></input>
                </div>

                <div id="telefones-wrapper">
                    {telefones.map((tel, index) => (
                        <TelefoneInput key={index} index={index} defaultValue={tel} />
                    ))}
                </div>
                <div className="w-56 h-auto mx-auto mt-2 text-center">
                    <button type="button" onClick={adicionarTelefone} className="text-unbblue underline">
                        + Adicionar outro telefone
                    </button>
                </div>

                <div className="w-56 h-22 mx-auto my-10">
                    <button type="submit" className="w-56 h-22 text-white text-2xl rounded-4xl bg-unbblue border-2 border-black">Salvar</button>
                </div>
            </form>
        </div>
        </>
    )
}

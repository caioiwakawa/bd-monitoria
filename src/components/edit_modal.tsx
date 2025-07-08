'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { Curso } from "@/lib/type"; // Você pode precisar ajustar os tipos aqui
import { Aluno } from "@/lib/type";

// O componente agora recebe o objeto 'aluno' completo para pré-preencher os campos
function EditModal(props: { setEdit: (value: boolean) => void, matricula: string, aluno: Aluno }) {

    const [cursos, setCursos] = useState<Curso[]>([]);

    useEffect(() => {
        async function fetchData() {
            const cursosRes = await fetch("/api/cursos");
            if (cursosRes.ok) setCursos(await cursosRes.json());
        }
        fetchData();
    }, []);     

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const res = await fetch(`/api/aluno/${props.matricula}`, {
            method: "PUT",
            body: formData,
        });

        if (res.ok) {
            alert("Aluno editado com sucesso!");
            window.location.reload(); // Recarrega a página para ver as alterações
        } else {
            const data = await res.json();
            alert(`Erro ao editar aluno: ${data.erro || 'Erro desconhecido'}`);
        }
    }

    // A lógica dos telefones permanece a mesma
    const [telefonesCount, setTelefonesCount] = useState(props.aluno.tb_aluno_telefones.length || 1);
    function adicionarTelefone() {
        setTelefonesCount((prev) => prev + 1);
    }

    return (
        <>
        <div className="fixed w-screen h-screen top-0 left-0 z-10 opacity-50 bg-white"></div>
        <div className="absolute w-132 h-auto z-20 top-30 left-1/2 -ml-66 rounded-4xl bg-gray-100 border-2 border-unbblue">
            <button onClick={() => props.setEdit(false)} className="absolute top-7 right-7 w-14 h-14"><Image src="/exit.png" alt="Sair" fill/></button>
            <div className="relative w-38 h-38 mx-auto top-7">
                <Image src={`/api/foto/${props.matricula}` || "/perfil_generico.png"} alt="Foto de Perfil" fill className="rounded-full object-cover"/>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="relative w-16 h-16 -top-4 mx-auto">
                    <input type="file" name="foto_perfil" accept="image/*" className="w-16 h-16 z-30 text-white"/> 
                </div>
                {/* OS CAMPOS AGORA USAM 'defaultValue' PARA MOSTRAR OS DADOS ATUAIS */}
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="nome" placeholder="Nome" className="text-2xl p-5 bg-transparent" defaultValue={props.aluno.nome_aluno}></input>
                </div>
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="email" placeholder="E-mail" className="text-2xl p-5 bg-transparent" defaultValue={props.aluno.email_aluno}></input>
                </div>
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="cpf" placeholder="CPF" className="text-2xl p-5 bg-transparent" defaultValue={props.aluno.cpf_aluno}></input>
                </div>
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="semestre" placeholder="Semestre de Ingresso" className="text-2xl p-5 bg-transparent" defaultValue={props.aluno.semestre_ingresso_aluno}></input>
                </div>
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="ira" placeholder="IRA" className="text-2xl p-5 bg-transparent" defaultValue={props.aluno.ira}></input>
                </div>
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="status" placeholder="Status" className="text-2xl p-5 bg-transparent" defaultValue={props.aluno.status_aluno}></input>
                </div>

                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <select
                        name="codigo_curso"
                        className="w-full h-full px-8 rounded-2xl text-2xl bg-transparent"
                        defaultValue={props.aluno.tb_curso.codigo_curso} // Pré-seleciona o curso atual
                    >
                        <option value="" disabled>Selecione seu curso</option>
                        {cursos.map((curso) => (
                            <option key={curso.codigo_curso} value={curso.codigo_curso}>
                                {curso.nome_curso}
                            </option>
                        ))}
                    </select>
                </div>

                <div id="telefones-wrapper">
                    {/* Lógica para exibir os telefones existentes */}
                    {props.aluno.tb_aluno_telefones.map((tel, index) => (
                         <div key={index} className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                           <input name={`telefones[]`} placeholder={`Telefone ${index + 1}`} className="text-2xl p-5 bg-transparent" defaultValue={tel.num_telefone_aluno}></input>
                         </div>
                    ))}
                </div>
                
                <div className="w-56 h-22 mx-auto mb-10">
                    <button type="submit" className="w-56 h-22 text-white text-2xl rounded-4xl bg-unbblue border-2 border-black">Salvar</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default EditModal;

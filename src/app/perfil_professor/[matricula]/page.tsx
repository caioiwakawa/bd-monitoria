'use client'

import CommentBox from "@/components/comment";
import Header from "@/components/header";
import ProfileBox from "@/components/profile_box";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Professor } from "@/lib/type";
import EditModal from "@/components/edit_modal";
import ProfileTeacher from "@/components/profile_teacher";

interface PerfilProfessorProps {
  params: { matricula: string };
}

export default function PerfilProfessor({ params }: PerfilProfessorProps) {

    const router = useRouter();
    const { matricula } = params;
    const [professor, setProfessor] = useState<Professor | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [ edit, setEdit ] = useState(false);
    
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
        <main>
            <Header/>
            {edit && <EditModal matricula={matricula} setEdit={setEdit}/>}
            <button type="button" onClick={router.back} className="absolute top-28 left-20 w-14 h-14"><Image src="/arrow.png" alt="Voltar" fill /></button>
            <ProfileTeacher professor={professor} matricula={matricula} setEdit={setEdit}/>

            <div className="relative w-262 h-auto mx-auto bg-white border-2 border-t-0 border-unblightblue">
                <h1 className="relative top-2 left-2 mb-5 font-bold">Seleções</h1>
                <div className="w-254 h-26 mx-auto mb-5 content-center bg-unbblue rounded-2xl"><h1 className="mx-auto w-244 text-white text-3xl">Parabéns, Morty! Você foi selecionado para ser monitor de APC, da turma 8 - 24N34</h1></div>
            </div>
            
            <div className="relative w-262 h-auto mx-auto pb-5 bg-white border-2 border-y-0 border-unblightblue">
                <h1 className="relative top-2 left-2 mb-5 font-bold">Comentários</h1>
                <CommentBox/>
            </div>
        </main>
    )
}
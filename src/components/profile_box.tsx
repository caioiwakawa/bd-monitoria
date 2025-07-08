'use client'

import { Aluno } from "@/lib/type";
import Image from "next/image";
import { useRouter } from "next/navigation";

function ProfileBox(props: {aluno: Aluno, matricula: string, setEdit: (value: boolean) => void}) {

    const router = useRouter();

    const handleDelete = async () => {
        if (window.confirm("Tem certeza que deseja apagar este perfil? Esta ação não pode ser desfeita e irá remover todos os dados associados.")) {
            const res = await fetch(`/api/aluno/${props.matricula}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Usuário removido com sucesso.");
                router.push("/");
            } else {
                alert("Erro ao remover usuário.");
            }
        }
    }
    
    // Usamos "optional chaining" (?.) para aceder aos dados de forma segura
    const nomeCurso = props.aluno.tb_curso?.nome_curso || "Curso não informado";
    const nomeDepartamento = props.aluno.tb_curso?.tb_departamento?.nome_departamento || "Departamento não informado";

    return (
        <div className="relative w-262 h-86 mx-auto bg-white border-2 border-t-0 border-unblightblue">
            <div className="w-full h-32 bg-unbcyan"></div>
            <div className="relative w-38 h-38 z-10 -top-19 left-20">
                <Image 
                    src={`/api/foto/${props.matricula}`} 
                    alt="Foto de Perfil" 
                    fill 
                    className="rounded-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/perfil_generico.png'; }}
                />
            </div>
            <h1 className="absolute top-52 left-20 text-3xl font-medium">{props.aluno.nome_aluno}</h1>
            
            {/* DADOS DO CURSO E DEPARTAMENTO AGORA SÃO DINÂMICOS */}
            <div className="relative w-8 h-7 left-20 -top-6"><Image src="/cap.png" alt="Departamento" fill/></div>
            <h1 className="relative -top-13.5 left-30 text-lg">{nomeDepartamento} / {nomeCurso}</h1>
            
            <div className="relative w-6 h-4 left-21 -top-9"><Image src="/mail.png" alt="Email" fill/></div>
            <h1 className="relative -top-15 left-30 text-lg">{props.aluno.email_aluno}</h1>

            <div className="absolute top-34 right-20 w-80 h-auto">
                {/* O botão agora chama a função setEdit corretamente */}
                <button type="button" onClick={() => props.setEdit(true)} className="w-80 h-13 m-2 rounded-3xl bg-blue-900 text-2xl text-white border-2 border-black">Editar Perfil</button>
                <button type="button" onClick={handleDelete} className="w-80 h-13 m-2 rounded-3xl bg-red-400 text-2xl text-white border-2 border-black">Excluir Perfil</button>
            </div>
        </div>
    )
}

export default ProfileBox;

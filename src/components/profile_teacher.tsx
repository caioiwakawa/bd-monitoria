import { Aluno, Professor } from "@/lib/type";
import Image from "next/image";
import { useRouter } from "next/navigation";

function ProfileTeacher(props: {professor: Professor, matricula: string, setEdit: Function}) {

    const router = useRouter();

    const handleDelete = async () => {
        const res = await fetch(`/api/professor/${props.matricula}`, {
            method: "DELETE",
        });

        if (res.ok) {
            console.log("Usuario removido");
            router.push("/");
        } else {
            alert("Erro ao remover usuario");
        }
    }

    return (
        <div className="relative w-262 h-86 mx-auto bg-white border-2 border-t-0 border-unblightblue">
            <div className="w-full h-32 bg-unbcyan"></div>
            <div className="relative w-38 h-38 z-10 -top-19 left-20">
                <Image src={`/api/foto/${props.matricula}` ? `/api/foto/${props.matricula}` : "/perfil_generico.png"} alt="Foto de Perfil" fill className="rounded-full"/>
            </div>
            <h1 className="absolute top-52 left-20 text-3xl font-medium">{props.professor.nome_professor}</h1>
            <div className="relative w-8 h-7 left-20 -top-6"><Image src="/cap.png" alt="Departamento" fill/></div>
            <h1 className="relative -top-13.5 left-30 text-lg">Departamento / Curso</h1>
            <div className="relative w-6 h-4 left-21 -top-9"><Image src="/mail.png" alt="Departamento" fill/></div>
            <h1 className="relative -top-15 left-30 text-lg">{props.professor.email_professor}</h1>

            <div className="absolute top-34 right-20 w-80 h-auto">
                <button type="button" onClick={() => props.setEdit(true)} className="w-80 h-13 m-2 rounded-3xl bg-blue-900 text-2xl text-white border-2 border-black">Editar Perfil</button>
                <button type="button" onClick={handleDelete} className="w-80 h-13 m-2 rounded-3xl bg-red-400 text-2xl text-white border-2 border-black">Excluir Perfil</button>
            </div>
        </div>
    )
}

export default ProfileTeacher;
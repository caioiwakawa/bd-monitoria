import Image from "next/image";
import { useEffect, useState } from "react";
import { Curso, Disciplina } from "@/lib/type";

function TelefoneInput({ index }: { index: number }) {
    return (
        <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
            <input name={`telefones[]`} placeholder={`Telefone ${index + 1}`} className="text-2xl p-5"></input>
        </div>
    )
}

function EditModal(props: { setEdit: Function, matricula: string }) {

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

        const res = await fetch(`/api/aluno/${props.matricula}`, {
            method: "PUT",
            body: formData,
        });

        if (res.ok) {
            alert("Aluno editado com sucesso!");
            window.location.reload();
        } else {
            const data = await res.json();
            alert(`Erro ao editar aluno: ${data.erro || 'Erro desconhecido'}`);
        }
    }

    const [telefonesCount, setTelefonesCount] = useState(1);
    function adicionarTelefone() {
        setTelefonesCount((prev) => prev + 1); // adiciona mais um campo de telefone
    }

    return (
        <>
        <div className="fixed w-screen h-screen top-0 left-0 z-10 opacity-50 bg-white"></div>
        <div className="absolute w-132 h-auto z-20 top-30 left-1/2 -ml-66 rounded-4xl bg-gray-100 border-2 border-unbblue">
            <button onClick={() => props.setEdit(false)} className="absolute top-7 right-7 w-14 h-14"><Image src="/exit.png" alt="Sair" fill/></button>
            <div className="relative w-38 h-38 mx-auto top-7">
                <Image src={`/api/foto/${props.matricula}` ? `/api/foto/${props.matricula}` : "/perfil_generico.png"} alt="Foto de Perfil" fill className="rounded-full"/>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="relative w-16 h-16 -top-4 mx-auto">
                    <input
                        type="file"
                        name="foto_perfil"
                        accept="image/*"
                        className="w-16 h-16 z-30 text-white"
                    /> 
                </div>
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="nome" placeholder="Nome" className="text-2xl p-5"></input>
                </div>
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="email" placeholder="E-mail" className="text-2xl p-5"></input>
                </div>
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="cpf" placeholder="CPF" className="text-2xl p-5"></input>
                </div>
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="semestre" placeholder="Semestre de Ingresso" className="text-2xl p-5"></input>
                </div>
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="ira" placeholder="IRA" className="text-2xl p-5"></input>
                </div>
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="status" placeholder="Status" className="text-2xl p-5"></input>
                </div>

                {/* CAMPO DE CURSO SUBSTITUÍDO POR UM DROPDOWN */}
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <select
                        name="codigo_curso" // O nome agora é o código, não o nome do curso
                        className="w-full h-full px-8 rounded-2xl text-2xl"
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

                <div id="telefones-wrapper">
                    {Array.from({ length: telefonesCount }).map((_, index) => (
                    <TelefoneInput key={index} index={index} />
                    ))}
                </div>
                <div className="w-56 h-22 mx-auto mt-10">
                    <button
                        type="button"
                        onClick={adicionarTelefone}
                    >
                        + Adicionar outro telefone
                    </button>
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
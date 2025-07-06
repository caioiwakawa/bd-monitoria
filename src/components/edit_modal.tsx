import Image from "next/image";
import { Aluno } from "@/lib/type"
import FormBox from "./form_box";

function EditModal(props: { setEdit: Function, matricula: string }) {
    return (
        <>
        <div className="fixed w-screen h-screen top-0 left-0 z-10 opacity-50 bg-white"></div>
        <div className="absolute w-132 h-auto z-20 top-30 left-1/2 -ml-66 rounded-4xl bg-gray-100 border-2 border-unbblue">
            <button onClick={() => props.setEdit(false)} className="absolute top-7 right-7 w-14 h-14"><Image src="/exit.png" alt="Sair" fill/></button>
            <div className="relative w-38 h-38 mx-auto top-7">
                <Image src={`/api/foto/${props.matricula}` ? `/api/foto/${props.matricula}` : "/perfil_generico.png"} alt="Foto de Perfil" fill className="rounded-full"/>
            </div>
            <form>
                <div className="relative w-16 h-16 -top-4 mx-auto">
                    <button type="button">
                        <Image src="/camera.png" alt="Mudar Foto de Perfil" fill/>
                    </button>
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
                <div className="w-92 h-20 mx-auto my-5 rounded-3xl bg-unblightblue border-2 border-black">
                    <input name="curso" placeholder="Curso" className="text-2xl p-5"></input>
                </div>
                <div className="w-56 h-22 mx-auto my-10">
                    <button className="w-56 h-22 text-white text-2xl rounded-4xl bg-unbblue border-2 border-black">Salvar</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default EditModal;
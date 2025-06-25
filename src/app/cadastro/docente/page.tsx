import LoginHeader from "@/components/login_header";
import FormBox from "@/components/form_box";
import Link from "next/link";

export default function CadastroDocente() {
    return (
        <main>
            <LoginHeader/>
            <div className="relative mx-auto top-20 w-132 h-350 bg-unblightblue border-2 border-unbblue rounded-4xl">
                <h1 className="text-center my-7 text-4xl font-medium w-full">Cadastro</h1>
                <form>
                    <FormBox placeholder="Nome"/>
                    <FormBox placeholder="Matrícula"/>
                    <FormBox placeholder="E-mail"/>
                    <FormBox placeholder="Telefone"/>
                    <FormBox placeholder="CPF"/>
                    <FormBox placeholder="Data de Ingresso"/>
                    <FormBox placeholder="Cargo"/>
                    <FormBox placeholder="Departamento"/>
                    <FormBox placeholder="Senha" senha={true}/>
                    <button type="submit" className="w-40 h-20 mx-46 mb-5 bg-unbblue rounded-3xl border-1 border-black text-2xl text-white">Criar Conta</button>
                    <Link href="/"><h1 className="text-center text-white my-5">Já tem uma conta? Faça o login</h1></Link>
                </form>
            </div>
            <div className="absolute top-406 w-screen h-24 bg-unbblue"></div>
        </main>
    )
}
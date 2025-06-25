import FormBox from "@/components/form_box";
import LoginHeader from "@/components/login_header";
import Link from "next/link";

export default function Login() {
    return (
        <main>
            <LoginHeader/>
            <div className="relative mx-auto top-20 w-132 h-144 bg-unblightblue border-2 border-unbblue rounded-4xl">
                <h1 className="text-center my-7 text-4xl font-medium w-full">Login</h1>
                <form>
                    <FormBox placeholder="Matrícula"/>
                    <FormBox placeholder="Senha" senha={true}/>
                    <button type="submit" className="w-40 h-20 mx-46 mb-5 bg-unbblue rounded-3xl border-1 border-black text-2xl text-white">Entrar</button>
                </form>
                <Link href="/cadastro/docente"><h1 className="text-center text-white my-5">Primeiro acesso, docente? Crie sua conta</h1></Link>
                <Link href="/cadastro/discente"><h1 className="text-center text-white my-5">Primeiro acesso, discente? Crie sua conta</h1></Link>
            </div>
            <div className="absolute top-200 w-screen h-24 bg-unbblue"></div>
        </main>
    )
}
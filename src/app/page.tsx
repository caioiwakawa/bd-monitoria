"use client";
import FormBox from "@/components/form_box";
import LoginHeader from "@/components/login_header";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { setMatricula, setTipo } = useUser();
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const res = await fetch("/api/login", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      const matricula = data.matricula; // <- importante
      const tipo = data.tipo;

      if (matricula && tipo) {
        setMatricula(matricula);
        setTipo(tipo);
        router.push("/feed");
      } else {
        alert("Erro: matrícula não recebida.");
      }
    } else {
      alert("Matrícula ou CPF inválida.");
    }
  }

  return (
    <main>
      <LoginHeader />
      <div className="relative mx-auto top-20 w-132 h-144 bg-unblightblue border-2 border-unbblue rounded-4xl">
        <h1 className="text-center my-7 text-4xl font-medium w-full">Login</h1>
        <form onSubmit={handleSubmit}>
          <FormBox name="matricula" placeholder="Matrícula" />
          <FormBox name="cpf" placeholder="CPF" />
          <button
            type="submit"
            className="w-40 h-20 mx-46 mb-5 bg-unbblue rounded-3xl border-1 border-black text-2xl text-white"
          >
            Entrar
          </button>
        </form>
        <Link href="/cadastro/docente">
          <h1 className="text-center text-white my-5">
            Primeiro acesso, docente? Crie sua conta
          </h1>
        </Link>
        <Link href="/cadastro/discente">
          <h1 className="text-center text-white my-5">
            Primeiro acesso, discente? Crie sua conta
          </h1>
        </Link>
      </div>
      <div className="absolute top-200 w-screen h-24 bg-unbblue"></div>
    </main>
  );
}

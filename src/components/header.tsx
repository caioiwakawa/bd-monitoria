"use client";

import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

function Header() {
  const { matricula, logout } = useUser();
  const router = useRouter();

  const fotoUrl = matricula ? `/api/foto/${matricula}` : "/default.png";

  const handleLogout = () => {
    logout;
    router.push(`/`);
  };

  return (
    <div className="relative w-screen h-24 bg-unbblue">
      <div className="absolute w-24 h-13 top-5.5 left-6">
        <Image src="/unb_logo.png" alt="Logo da UnB" fill />
      </div>
      <h1 className="relative w-100 h-10 mx-auto top-7 text-center text-4xl font-bold text-white">
        Monitoria
      </h1>

      {matricula && (
        <>
          <button
            onClick={handleLogout}
            className="absolute w-11 h-11 top-6.5 right-7"
          >
            <Image src="/SignOut.png" alt="Sair" fill />
          </button>
          <div
            onClick={() => router.push(`/perfil/${matricula}`)}
            className="absolute w-11 h-11 top-6.5 right-25 rounded-full overflow-hidden cursor-pointer"
          >
            <Image src={fotoUrl} alt="Foto do aluno" fill />
          </div>
        </>
      )}
    </div>
  );
}

export default Header;

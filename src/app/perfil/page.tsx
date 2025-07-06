'use client'

import Header from "@/components/header";
import ProfileBox from "@/components/profile_box";
import { useRouter } from "next/navigation";

export default function PerfilDiscente(){

     const router = useRouter();

    return (
        <main>
            <Header/>
            <ProfileBox/>
            <div className="relative w-262 h-auto mx-auto bg-white border-2 border-t-0 border-unblightblue">
                <h1 className="relative top-2 left-2 mb-5 font-bold">Seleções</h1>
                <div className="w-254 h-26 mx-auto mb-5 content-center bg-unbblue rounded-2xl"><h1 className="mx-auto w-244 text-white text-3xl">Parabéns, Morty! Você foi selecionado para ser monitor de APC, da turma 8 - 24N34</h1></div>
            </div>
            <div className="relative w-262 h-auto mx-auto bg-white border-2 border-y-0 border-unblightblue">
                <h1 className="relative top-2 left-2 mb-5 font-bold">Comentários</h1>
            </div>
        </main>
    )
}
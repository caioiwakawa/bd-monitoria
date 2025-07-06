import Image from "next/image";

function CommentBox() {
    return (
        <div className="relative w-254 h-80 mx-auto mb-5 bg-unbcyan rounded-2xl">
            <div className="relative top-6 w-16 h-16 m-6"><Image src="/perfil_generico.png" alt="Foto de Perfil" fill className="rounded-full"></Image></div>
            <h1 className="absolute top-10 left-28 text-2xl font-light text-gray-200 ">Nome do Usuario</h1>
            <p className="relative top-6 w-246 h-auto mx-auto text-3xl text-white">
                Ser monitor de Software Básico é um barato, eu fui na época que estava na Graduação!
            </p>
            <div className="absolute bottom-10 right-10 h-8">
                <button type="button" className="relative w-8 h-8 mr-10"><Image src="/edit.png" alt="Editar" fill></Image></button>
                <button type="button" className="relative w-10 h-10"><Image src="/Trash.png" alt="Editar" fill></Image></button>
            </div>
        </div>
    )
}

export default CommentBox;
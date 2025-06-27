import Image from "next/image"

function FeedBox(props: {titulo: string}) {
    return (
        <div className="relative w-80 h-66 bg-unblightblue rounded-2xl m-10">
            <div className="relative w-full h-1/2">
                <Image src="/stock.jpg" alt="Foto Generica para Disciplina" fill className="rounded-t-2xl"></Image>
            </div>
            <div className="relative w-full h-1/2">
                <h1 className="absolute left-4 top-4 w-9/10 h-3/5 align-middle text-left text-lg font-medium">{props.titulo}</h1>
                <div className="absolute bottom-3 right-3 w-6 h-6"><Image src="/bubble.png" alt="Bolha de Fala" fill></Image></div>
            </div>
        </div>
    )
}

export default FeedBox;
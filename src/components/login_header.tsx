import Image from "next/image";

function LoginHeader() {
    return (
        <>
        <div className="relative inline-block w-36 h-20 top-10 left-15"><Image src="/unb_logo.png" alt="Logo da Unb" fill></Image></div>
        <h1 className="absolute inline-block text-5xl top-15 left-57 font-medium">Monitoria</h1>
        </>
    )
}

export default LoginHeader;
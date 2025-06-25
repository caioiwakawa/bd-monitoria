import Image from "next/image";
import Link from "next/link";

function Header() {
    return (
        <div className="relative w-screen h-24 bg-unbblue">
            <div className="absolute w-24 h-13 top-5.5 left-6"><Image src="/unb_logo.png" alt="Logo da Unb" fill></Image></div>
            <Link href="/"><button type="button" className="absolute w-11 h-11 top-6.5 right-7"><Image src="/SignOut.png" alt="Logo da Unb" fill></Image></button></Link>
        </div>
    )
}

export default Header;
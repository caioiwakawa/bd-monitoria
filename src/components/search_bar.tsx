import Image from "next/image";

function SearchBar() {
    return (
        <div className="relative left-225 my-6 w-96 h-13 bg-white rounded-3xl">
            <div className="relative inline-block w-8 h-8 top-2.5 left-10"><Image src="/MagnifyingGlass.png" alt="Lupa de Busca" fill></Image></div>
            <input type="text" placeholder="Buscar" className="relative inline-block top-0.5 left-15 text-xl"></input>
        </div>
    )
}

export default SearchBar;
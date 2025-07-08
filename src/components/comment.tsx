import Image from "next/image";

// O tipo agora espera um objeto 'autor' e um objeto 'monitor'
type ComentarioProps = {
  comentario: {
    id_composto: any;
    comentario: string;
    nota: number;
    autor: {
      nome: string;
      matricula?: number; // A matrícula do autor do comentário
    };
    monitor: {
      nome: string;
    };
  };
  onEdit: (comentario: any) => void;
  onDelete: (comentario: any) => void;
};

export default function CommentBox({ comentario, onEdit, onDelete }: ComentarioProps) {
  // LÓGICA DA IMAGEM ATUALIZADA:
  // Usa a matrícula do AUTOR para buscar a foto.
  const fotoSrc = 
    comentario.autor && typeof comentario.autor.matricula === 'number'
      ? `/api/foto/${comentario.autor.matricula}`
      : "/perfil_generico.png";

  return (
    <div className="relative w-254 h-auto min-h-[20rem] mx-auto mb-5 p-6 bg-unbcyan rounded-2xl flex flex-col">
      <div className="flex items-center mb-4">
        <div className="relative w-16 h-16">
            <Image 
              src={fotoSrc} 
              alt={`Foto de perfil de ${comentario.autor.nome}`} 
              fill 
              className="rounded-full object-cover"
              onError={(e) => { e.currentTarget.src = '/perfil_generico.png'; }}
            />
        </div>
        {/* Mostra o nome do autor do comentário */}
        <h1 className="ml-4 text-2xl font-light text-gray-200 ">{comentario.autor.nome}</h1>
      </div>
      {/* Adiciona contexto sobre quem foi o alvo do comentário */}
      <p className="text-lg text-gray-300 mb-2">Comentário sobre: {comentario.monitor.nome}</p>
      <p className="flex-grow text-3xl text-white">
        "{comentario.comentario}"
      </p>
      <div className="flex justify-end items-center gap-10 h-10 mt-4">
        <div className="text-white text-xl">Nota: {comentario.nota}/5</div>
        <button onClick={() => onEdit(comentario)} type="button" className="relative w-8 h-8">
            <Image src="/edit.png" alt="Editar" fill></Image>
        </button>
        <button onClick={() => onDelete(comentario)} type="button" className="relative w-10 h-10">
            <Image src="/Trash.png" alt="Apagar" fill></Image>
        </button>
      </div>
    </div>
  );
}
import Image from "next/image";

function FeedBox(props: {
  titulo: string;
  tipo: string;
  descricao: string;
  cargaHoraria: number;
  bolsa: number;
  onClickTitulo: () => void;
  onClickComentario: () => void;
}) {
  return (
    <div className="relative w-80 h-auto bg-unblightblue rounded-2xl m-10 shadow-lg">
      <div className="relative w-full h-40">
        <Image
          src="/stock.jpg"
          alt="Foto da disciplina"
          fill
          className="rounded-t-2xl object-cover"
        />
      </div>
      <div className="p-4 space-y-2">
        <h1
          className="text-lg font-semibold cursor-pointer hover:underline"
          onClick={props.onClickTitulo}
          title="Clique para se inscrever"
        >
          {props.titulo}
        </h1>
        <p className="text-sm text-gray-700">
          <strong>Tipo:</strong> {props.tipo}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Descrição:</strong> {props.descricao}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Carga Horária:</strong> {props.cargaHoraria}h
        </p>
        <p className="text-sm text-gray-700">
          <strong>Bolsa:</strong> R$ {props.bolsa.toFixed(2)}
        </p>
      </div>
      <div
        className="absolute bottom-3 right-3 w-6 h-6 cursor-pointer"
        onClick={props.onClickComentario}
        title="Comentários"
      >
        <Image src="/bubble.png" alt="Bolha de Fala" fill />
      </div>
    </div>
  );
}

export default FeedBox;

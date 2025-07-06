"use client";

import { useEffect, useState, useRef } from "react";

type Comentario = {
  matricula: number;
  comentario: string;
  nota: number;
  nome: string;
  foto: string | null;
};

type ComentarioChatProps = {
  nomeDisciplina: string;
  codigoOferta: number;         // código da oferta monitoria/tutoria
  matriculaAvaliador: number;   // matrícula do aluno que fez a avaliação
};

export default function ChatBox({
  nomeDisciplina,
  codigoOferta,
  matriculaAvaliador,
}: ComentarioChatProps) {
  const [mensagens, setMensagens] = useState<Comentario[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [nota, setNota] = useState(5);
  const [loading, setLoading] = useState(false);
  const mensagensRef = useRef<HTMLDivElement>(null);

  // Função para buscar comentários
  const fetchComentarios = async () => {
    setLoading(true);
    try {
      // Removi matriculaMonitor do query string
      const res = await fetch(`/api/comentarios?codigoOferta=${codigoOferta}`);
      if (res.ok) {
        const data = await res.json();
        setMensagens(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, [codigoOferta]);

  useEffect(() => {
    // Scroll para baixo sempre que as mensagens mudam
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [mensagens]);

  const handleEnviar = async () => {
    if (!novaMensagem.trim()) return;

    await fetch("/api/comentarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigoOfertaMonTut: codigoOferta,  // mantive esse nome, pois seu backend espera assim
        // Removi matriculaAlunoMonitorTutor, só envio matriculaAlunoAvaliador
        matriculaAlunoAvaliador: matriculaAvaliador,
        comentarioAvaliacao: novaMensagem.trim(),
        notaAvaliacao: nota,
      }),
    });

    setNovaMensagem("");
    setNota(5);
    fetchComentarios(); // Atualiza comentários
  };

  return (
    <div className="flex flex-col h-96 w-full rounded-lg shadow-md border border-gray-200">
      {/* Cabeçalho */}
      <div className="p-3 bg-unbblue text-white rounded-t-lg select-none">
        <h2 className="font-semibold">
          Comentários da oferta: {nomeDisciplina}
        </h2>
      </div>

      {/* Área das mensagens */}
      <div
        ref={mensagensRef}
        className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50"
      >
        {loading && (
          <div className="text-center text-gray-500">Carregando...</div>
        )}

        {!loading && mensagens.length === 0 && (
          <div className="text-center text-gray-400">Nenhum comentário.</div>
        )}

        {mensagens.map((msg, i) => {
          const isAvaliador = msg.matricula === matriculaAvaliador;
          return (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                isAvaliador ? "justify-end" : "justify-start"
              }`}
            >
              {!isAvaliador && (
                <>
                  {msg.foto ? (
                    <img
                      src={`data:image/jpeg;base64,${msg.foto}`}
                      alt="Foto"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  )}
                </>
              )}
              <div
                className={`max-w-xs p-2 rounded-lg break-words ${
                  isAvaliador
                    ? "bg-blue-100 text-blue-800 text-right"
                    : "bg-gray-200 text-gray-800 text-left"
                }`}
              >
                <b>{msg.nome}</b>
                <p>{msg.comentario}</p>
                <div className="text-sm text-yellow-600 mt-1">Nota: {msg.nota}</div>
              </div>
              {isAvaliador && (
                <>
                  {msg.foto ? (
                    <img
                      src={`data:image/jpeg;base64,${msg.foto}`}
                      alt="Foto"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Input e botões */}
      <div className="p-3 border-t border-gray-300 flex gap-2 items-center">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="number"
          min={1}
          max={5}
          value={nota}
          onChange={(e) => setNota(Number(e.target.value))}
          className="w-20 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleEnviar}
          className="px-4 py-2 bg-unbblue text-white rounded hover:bg-blue-900 focus:outline-none"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

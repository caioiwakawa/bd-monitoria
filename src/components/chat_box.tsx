"use client";

import { useState } from "react";

type ComentarioChatProps = {
  nomeDisciplina: string;
};

export default function ChatBox({ nomeDisciplina }: ComentarioChatProps) {
  const [mensagens, setMensagens] = useState([
    { id: 1, nome: "Fulano", texto: "Olá" },
  ]);
  const [novaMensagem, setNovaMensagem] = useState("");

  const handleEnviar = () => {
    if (!novaMensagem.trim()) return;

    setMensagens([
      ...mensagens,
      {
        id: Date.now(),
        nome: "Você",
        texto: novaMensagem.trim(),
      },
    ]);
    setNovaMensagem("");
  };

  return (
    <div className="flex flex-col h-96 w-full rounded-lg shadow-md mb-4 border border-gray-200">
      {/* Cabeçalho */}
      <div className="p-3 bg-unbblue text-white rounded-t-lg">
        <h2 className="font-semibold">
          Comentários da oferta: {nomeDisciplina}
        </h2>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {mensagens.map((msg) => (
          <div key={msg.id}>
            <b>{msg.nome}</b>
            <div
              className={`p-2 rounded-lg max-w-xs ${
                msg.nome === "Você"
                  ? "bg-blue-100 text-blue-800 ml-auto"
                  : "bg-gray-200 text-gray-800 mr-auto"
              }`}
            >
              {msg.texto}
            </div>
          </div>
        ))}
      </div>

      {/* Input e botão */}
      <div className="p-3 border-t border-gray-300 flex gap-2">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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

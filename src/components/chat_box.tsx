"use client";

import { useEffect, useState, useRef } from "react";

import { useUser } from "@/context/UserContext";

type Comentario = {
  matricula: number;
  comentario: string;
  nota: number;
  nome: string;
  foto: string | null;
};

type Monitor = {
  matricula: number;
  nome: string;
  foto: string | null;
};

type ChatBoxProps = {
  codigoOferta: number;
  matriculaAvaliador: number;
  matriculaAvaliado: number | null;
};

export default function ChatBox({
  codigoOferta,
  matriculaAvaliador,
  matriculaAvaliado,
}: ChatBoxProps) {
  const { tipo } = useUser();
  const [monitores, setMonitores] = useState<Monitor[]>([]);
  const [matriculaSelecionada, setMatriculaSelecionada] = useState<
    number | null
  >(matriculaAvaliado);
  const [mensagens, setMensagens] = useState<Comentario[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [nota, setNota] = useState(5);
  const mensagensRef = useRef<HTMLDivElement>(null);

  // Função para buscar os comentários (pode ser chamada para atualizar)
  const fetchComentarios = async () => {
    if (!matriculaSelecionada) return;
    const res = await fetch(
      `/api/comentarios?codigoOferta=${codigoOferta}&matriculaMonitor=${matriculaSelecionada}`
    );
    if (res.ok) {
      const data = await res.json();
      setMensagens(data);
    }
  };

  useEffect(() => {
    const fetchMonitores = async () => {
      const res = await fetch(`/api/monitores?codigoOferta=${codigoOferta}`);
      if (res.ok) {
        const data = await res.json();
        setMonitores(data);
        if (!matriculaSelecionada && data.length > 0) {
          setMatriculaSelecionada(data[0].matricula);
        }
      }
    };
    fetchMonitores();
  }, [codigoOferta]);

  useEffect(() => {
    fetchComentarios();
  }, [codigoOferta, matriculaSelecionada]);

  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [mensagens]);

  const handleEnviar = async () => {
    if (!novaMensagem.trim() || !matriculaSelecionada || !matriculaAvaliador) {
      alert(
        "Não foi possível enviar: dados incompletos ou usuário não identificado."
      );
      return;
    }

    const res = await fetch("/api/comentarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigoOfertaMonTut: codigoOferta,
        matriculaAlunoMonitorTutor: matriculaSelecionada,
        matriculaAlunoAvaliador: matriculaAvaliador,
        comentarioAvaliacao: novaMensagem.trim(),
        notaAvaliacao: nota,
      }),
    });

    if (res.ok) {
      alert("Comentário enviado com sucesso!");
      setNovaMensagem("");
      setNota(5);
      fetchComentarios(); // Atualiza a lista de comentários após o sucesso
    } else {
      // LÓGICA DE ERRO ATUALIZADA
      const errorData = await res.json();
      if (res.status === 409) {
        // Se o erro for 409 (Conflict), mostra a mensagem específica do backend
        alert(errorData.error);
      } else {
        // Para outros erros, mostra uma mensagem genérica
        alert(
          `Falha ao enviar comentário: ${
            errorData.error || "Erro desconhecido"
          }`
        );
      }
    }
  };

  return (
    <div className="flex flex-col h-96 w-full rounded-lg shadow-md border border-gray-200">
      <div className="p-3 bg-unbblue text-white rounded-t-lg flex justify-between items-center">
        <h2 className="font-semibold">Comentários da oferta</h2>
        <select
          value={matriculaSelecionada ?? ""}
          onChange={(e) => setMatriculaSelecionada(Number(e.target.value))}
          className="text-black p-1 rounded"
        >
          {monitores.map((m) => (
            <option key={m.matricula} value={m.matricula}>
              {m.nome}
            </option>
          ))}
        </select>
      </div>

      <div
        ref={mensagensRef}
        className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50"
      >
        {mensagens.length === 0 ? (
          <div className="text-center text-gray-400">Nenhum comentário.</div>
        ) : (
          mensagens.map((msg, i) => {
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
                  <div className="text-sm text-yellow-600 mt-1">
                    Nota: {msg.nota}
                  </div>
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
          })
        )}
      </div>

      {tipo != "professor" && (
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
      )}
    </div>
  );
}

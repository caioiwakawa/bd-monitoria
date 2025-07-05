'use client'

import { useEffect, useState } from "react";
import FeedBox from "@/components/feed_box";
import FeedFlexBox from "@/components/feed_flexbox";
import Header from "@/components/header";
import SearchBar from "@/components/search_bar";

type Monitoria = {
  codigoOferta: number;
  nomeDisciplina: string;
  tipo: string;
  descricao: string;
  cargaHoraria: number;
  bolsa: number;
};

export default function Feed() {
  const [monitorias, setMonitorias] = useState<Monitoria[]>([]);
  const [filtro, setFiltro] = useState("");
  const [modalInscricaoAberto, setModalInscricaoAberto] = useState<Monitoria | null>(null);
  const [modalComentarioAberto, setModalComentarioAberto] = useState<Monitoria | null>(null);

  useEffect(() => {
    const fetchMonitorias = async () => {
      const res = await fetch("/api/monitorias");
      const data = await res.json();
      setMonitorias(data);
    };
    fetchMonitorias();
  }, []);

  // Filtrar monitorias pelo filtro da busca (nomeDisciplina)
  const monitoriasFiltradas = monitorias.filter(mon =>
    mon.nomeDisciplina.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <main>
      <Header />

      {/* Passar o setFiltro para a SearchBar */}
      <SearchBar onSearch={setFiltro} />

      <FeedFlexBox>
        {monitoriasFiltradas.map((mon) => (
          <FeedBox
            key={mon.codigoOferta}
            titulo={mon.nomeDisciplina}
            tipo={mon.tipo}
            descricao={mon.descricao}
            cargaHoraria={mon.cargaHoraria}
            bolsa={mon.bolsa}
            onClickTitulo={() => setModalInscricaoAberto(mon)}
            onClickComentario={() => setModalComentarioAberto(mon)}
          />
        ))}
      </FeedFlexBox>

      {/* Modal inscrição */}
      {modalInscricaoAberto && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Inscrição na oferta: {modalInscricaoAberto.nomeDisciplina}</h2>
            {/* Aqui você coloca o formulário/infos para inscrição */}
            <button onClick={() => setModalInscricaoAberto(null)}>Fechar</button>
          </div>
        </div>
      )}

      {/* Modal comentários */}
      {modalComentarioAberto && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Comentários da oferta: {modalComentarioAberto.nomeDisciplina}</h2>
            {/* Aqui você coloca os comentários, ou formulário para comentar */}
            <button onClick={() => setModalComentarioAberto(null)}>Fechar</button>
          </div>
        </div>
      )}
    </main>
  );
}

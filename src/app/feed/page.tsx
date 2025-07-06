"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FeedBox from "@/components/feed_box";
import FeedFlexBox from "@/components/feed_flexbox";
import Header from "@/components/header";
import SearchBar from "@/components/search_bar";
import FormBox from "@/components/form_box";
import { useUser } from "@/context/UserContext";
import TurmaSelect from "@/components/turma_select";
import ChatBox from "@/components/chat_box";

type Monitoria = {
  codigoOferta: number;
  nomeDisciplina: string;
  tipo: string;
  descricao: string;
  cargaHoraria: number;
  bolsa: number;
  matriculaProfessorResponsavel: number;
};

type Turma = {
  codigo_disciplina: any;
  nome_disciplina: string;
  numero_turma: number;
  semestre_turma: string;
  professor: string;
  matricula_professor: number;
};

export default function Feed() {
  const { matricula, tipo } = useUser();

  const [monitorias, setMonitorias] = useState<Monitoria[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [filtro, setFiltro] = useState("");
  const [modalInscricaoAberto, setModalInscricaoAberto] =
    useState<Monitoria | null>(null);
  const [modalComentarioAberto, setModalComentarioAberto] =
    useState<Monitoria | null>(null);

  const [modalEdicaoMonitoria, setModalEdicaoMonitoria] =
    useState<Monitoria | null>(null);
  const [modalNovaMonitoria, setModalNovaMonitoria] = useState(false);

  useEffect(() => {
    console.log(tipo);

    const fetchMonitorias = async () => {
      const res = await fetch("/api/monitorias");
      const data = await res.json();
      setMonitorias(data);
    };
    fetchMonitorias();

    const fetchTurmas = async () => {
      const res = await fetch("/api/turmas");
      const data = await res.json();
      setTurmas(data);
    };
    fetchTurmas();
  }, []);

  // Filtrar monitorias pelo filtro da busca (nomeDisciplina)
  const monitoriasFiltradas = monitorias.filter((mon) =>
    mon.nomeDisciplina.toLowerCase().includes(filtro.toLowerCase())
  );

  // SELECT TURMAS
  const [selectedCodigo, setSelectedCodigo] = useState<string>("");

  const handleSelectTurma = (codigoDisciplina: string) => {
    setSelectedCodigo(codigoDisciplina);
    console.log("Código selecionado:", codigoDisciplina);
    // Aqui você pode filtrar dados ou fazer outras ações com o código.
  };

  // HANDLESUBMITS------------------------------------------------------------------------------------------------
  async function handleEditarMonitoria(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    // Obter os valores do formulário
    const formData = new FormData(event.currentTarget);
    const data = {
      codigoOferta: formData.get("codigoOferta") as string,
      tipo: formData.get("tipo") as string,
      descricao: formData.get("descricao") as string,
      cargaHoraria: formData.get("cargaHoraria") as string,
      bolsa: formData.get("bolsa") as string,
      matriculaProfessorResponsavel: matricula,
    };

    try {
      const res = await fetch("/api/editar_monitoria", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Importante!
        },
        body: JSON.stringify({
          codigoOferta: Number(data.codigoOferta),
          tipo: data.tipo,
          descricao: data.descricao,
          cargaHoraria: Number(data.cargaHoraria),
          bolsa: parseFloat(data.bolsa),
          matriculaProfessorResponsavel: Number(
            data.matriculaProfessorResponsavel
          ),
        }),
      });

      if (res.ok) {
        alert("Oferta editada com sucesso!");
        window.location.href = "/feed";
      } else {
        const errorData = await res.json();
        alert(
          `Erro ao editar oferta: ${errorData.error || "Erro desconhecido"}`
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Falha na comunicação com o servidor");
    }
  }

  // -------------------------------------------------------------------------------------

  async function handleNovaMonitoria(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const turmaFiltrada = turmas
      .filter((turma) => turma.codigo_disciplina === selectedCodigo) // Filtra pelo código
      .map((turma) => ({
        codigo_disciplina: turma.codigo_disciplina,
        numero_turma: turma.numero_turma,
        semestre_turma: turma.semestre_turma,
      }));

    // Obter os valores do formulário
    const formData = new FormData(event.currentTarget);
    const data = {
      matricula_professor_responsavel: matricula,
      tipo_oferta: formData.get("tipo_oferta") as string,
      desc_oferta: formData.get("desc_oferta") as string,
      carga_horaria_oferta: formData.get("carga_horaria_oferta") as string,
      bolsa_oferta: formData.get("bolsa_oferta") as string,
      turmas: turmaFiltrada,
    };

    const res = await fetch("/api/cadastrar_monitorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Importante para o servidor entender que é JSON
      },
      body: JSON.stringify(data), // Envia como JSON
    });

    if (res.ok) {
      alert("Oferta cadastrada com sucesso!");
      // Fechar o modal após sucesso (opcional)
      setModalInscricaoAberto(null);
    } else {
      alert("Erro ao cadastrar oferta.");
    }
  }

  return (
    <main>
      <Header />

      {/* Passar o setFiltro para a SearchBar */}
      <SearchBar onSearch={setFiltro} />

      {tipo == "professor" && (
        <FeedFlexBox>
          <div className="flex w-full justify-between">
            <button
              className="h-15 m-10 px-1 mb-5 bg-unbblue rounded-3xl border-1 border-black text-xl text-white"
              onClick={() => setModalNovaMonitoria(true)}
            >
              Criar nova oportunidade de monitoria/tutoria
            </button>
            <button className="h-15 m-10 px-1 mb-5 bg-unbblue rounded-3xl border-1 border-black text-xl text-white">
              Criar nova oportunidade de monitoria/tutoria
            </button>
          </div>

          <div className="grid">
            <h2 className="text-xl mt-10 mx-10 font-bold">
              Oportunidades de monitoria criadas por você:
            </h2>
            {monitoriasFiltradas
              .filter((mon) => mon.matriculaProfessorResponsavel === matricula)
              .map((mon) => (
                <FeedBox
                  key={mon.codigoOferta}
                  titulo={mon.nomeDisciplina}
                  tipo={mon.tipo}
                  descricao={mon.descricao}
                  cargaHoraria={mon.cargaHoraria}
                  bolsa={mon.bolsa}
                  onClickTitulo={() => setModalEdicaoMonitoria(mon)}
                  onClickComentario={() => setModalComentarioAberto(mon)}
                />
              ))}
          </div>
        </FeedFlexBox>
      )}

      {/* Modal nova monitoria */}
      {modalNovaMonitoria && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 className="text-xl">Criar nova oferta</h2>
            <form onSubmit={handleNovaMonitoria}>
              <FormBox name="tipo_oferta" placeholder="Tipo de Oferta" />
              <FormBox name="desc_oferta" placeholder="Descrição breve" />
              <FormBox
                name="carga_horaria_oferta"
                placeholder="Carga horária em números"
              />
              <FormBox name="bolsa_oferta" placeholder="Valor da bolsa" />
              <TurmaSelect turmas={turmas} onSelect={handleSelectTurma} />
              {/* {selectedCodigo && (
                <p className="mt-2">
                  Turma selecionada: <strong>{selectedCodigo}</strong>
                </p>
              )} */}
              <button
                type="submit"
                className="w-40 h-15 mx-46 mb-5 bg-unbblue rounded-3xl border-1 border-black text-2xl text-white"
              >
                Criar Oferta
              </button>
            </form>

            <button onClick={() => setModalNovaMonitoria(false)}>Fechar</button>
          </div>
        </div>
      )}

      {/* Modal inscrição */}
      {modalEdicaoMonitoria && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 className="mb-5">
              Edição da oferta: {modalEdicaoMonitoria.nomeDisciplina}
            </h2>
            <p>
              tipo cadastrado: <b>{modalEdicaoMonitoria.tipo}</b>
            </p>
            <p>
              descrição cadastrada: <b>{modalEdicaoMonitoria.descricao}</b>
            </p>
            <p>
              carga horária cadastrada:{" "}
              <b>{modalEdicaoMonitoria.cargaHoraria}</b>
            </p>
            <p>
              bolsa cadastrada: <b>{modalEdicaoMonitoria.bolsa}</b>
            </p>
            <form onSubmit={handleEditarMonitoria}>
              <FormBox name="tipo" placeholder="Tipo" />
              <FormBox name="descricao" placeholder="Descrição" />
              <FormBox name="cargaHoraria" placeholder="Carga Horária" />
              <FormBox name="bolsa" placeholder="Bolsa" />
              <input
                className="hidden"
                type="text"
                name="codigoOferta"
                defaultValue={modalEdicaoMonitoria.codigoOferta}
              />
              <button
                type="submit"
                className="w-40 h-15 mx-46 mb-5 bg-unbblue rounded-3xl border-1 border-black text-2xl text-white"
              >
                Editar Oferta
              </button>
            </form>

            <button onClick={() => setModalEdicaoMonitoria(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {tipo == "aluno" && (
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
      )}

      {/* Modal inscrição */}
      {modalInscricaoAberto && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Inscrição na oferta: {modalInscricaoAberto.nomeDisciplina}</h2>
            <FormBox name="nome" placeholder="Nome" />
            <FormBox name="matricula" placeholder="Matrícula" />
            <FormBox name="email" placeholder="E-mail" />
            <button onClick={() => setModalInscricaoAberto(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal comentários */}
      {modalComentarioAberto && (
        <div className="modal-backdrop">
          <div className="modal-content">
            {/* COMECA AQUI O CHAT */}
            <ChatBox nomeDisciplina={modalComentarioAberto.nomeDisciplina} />
            {/* TERMINA AQUI O CHAT */}
            <button onClick={() => setModalComentarioAberto(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

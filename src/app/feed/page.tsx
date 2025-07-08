"use client";

import { SetStateAction, useEffect, useState } from "react";
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
  // O hook useUser já nos dá a matrícula do aluno logado!
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

  // Estados para controlar o feedback da inscrição
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
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

  const monitoriasFiltradas = monitorias.filter((mon) =>
    mon.nomeDisciplina.toLowerCase().includes(filtro.toLowerCase())
  );

  // Funções para professores (sem alterações)
  async function handleEditarMonitoria(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
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
        headers: { "Content-Type": "application/json" },
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
        window.location.reload();
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

  const [selectedCodigo, setSelectedCodigo] = useState<string>("");
  const handleSelectTurma = (codigoDisciplina: string) => {
    setSelectedCodigo(codigoDisciplina);
  };

  async function handleNovaMonitoria(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const turmaFiltrada = turmas
      .filter((turma) => turma.codigo_disciplina === selectedCodigo)
      .map((turma) => ({
        codigo_disciplina: turma.codigo_disciplina,
        numero_turma: turma.numero_turma,
        semestre_turma: turma.semestre_turma,
      }));
    const formData = new FormData(event.currentTarget);
    const data = {
      matricula_professor_responsavel: matricula,
      tipo_oferta: formData.get("tipo_oferta") as string,
      desc_oferta: formData.get("desc_oferta") as string,
      carga_horaria_oferta: formData.get("carga_horaria_oferta") as string,
      bolsa_oferta: formData.get("bolsa_oferta") as string,
      turmas: turmaFiltrada,
      matricula_aluno_monitor_tutor: formData.get(
        "matricula_aluno_monitor_tutor"
      ) as string,
      horario_mon_tut: formData.get("horario_mon_tut") as string,
    };
    const res = await fetch("/api/cadastrar_monitorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      alert("Oferta cadastrada com sucesso!");
      window.location.reload();
    } else {
      alert("Erro ao cadastrar oferta.");
    }
  }

  // --- LÓGICA DE INSCRIÇÃO ATUALIZADA ---
  const handleInscricao = async () => {
    if (!modalInscricaoAberto || !matricula) {
      alert("Erro: Não foi possível identificar a oferta ou o usuário.");
      return;
    }
    setMensagem(null);
    setCarregando(true);
    try {
      const response = await fetch("/api/inscrever_monitoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricula_aluno: matricula,
          codigo_oferta_mon_tut: modalInscricaoAberto.codigoOferta,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMensagem("Inscrição realizada com sucesso!");
      } else {
        setMensagem(
          `Falha na inscrição: ${data.error || "Erro desconhecido."}`
        );
      }
    } catch (err) {
      setMensagem("Erro de conexão com o servidor.");
    }
    setCarregando(false);
  };

  const fecharModalInscricao = () => {
    setModalInscricaoAberto(null);
    setMensagem(null);
    setCarregando(false);
  };

  return (
    <main>
      <Header />
      <SearchBar onSearch={setFiltro} />

      {/* Renderização para professores */}
      {tipo === "professor" && (
        <FeedFlexBox>
          <div className="flex w-full justify-between">
            <button
              className="h-15 m-10 px-1 mb-5 bg-unbblue rounded-3xl border-1 border-black text-xl text-white"
              onClick={() => setModalNovaMonitoria(true)}
            >
              Criar nova oportunidade de monitoria/tutoria
            </button>
          </div>
          <div className="grid">
            <h2 className="text-xl mt-10 mx-10 font-bold">
              Oportunidades de monitoria criadas por você:
            </h2>
            <div className="relative flex flex-wrap flex-1/4 mx-auto mb-25 w-300 h-auto">
              {monitorias
                .filter(
                  (mon) => mon.matriculaProfessorResponsavel === matricula
                )
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
          </div>
        </FeedFlexBox>
      )}

      {/* Renderização para alunos */}
      {tipo === "aluno" && (
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

      {/* Modais para professores (sem alterações) */}
      {modalNovaMonitoria && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 className="text-xl">Criar nova oferta</h2>
            <form
              onSubmit={handleNovaMonitoria}
              className="max-h-[600px] overflow-y-auto"
            >
              <FormBox name="tipo_oferta" placeholder="Tipo de Oferta" />
              <FormBox name="desc_oferta" placeholder="Descrição breve" />
              <FormBox
                name="carga_horaria_oferta"
                placeholder="Carga horária em números"
              />
              <FormBox name="bolsa_oferta" placeholder="Valor da bolsa" />
              <TurmaSelect turmas={turmas} onSelect={handleSelectTurma} />
              <FormBox
                name="matricula_aluno_monitor_tutor"
                placeholder="Matrícula do monitor de referência (opcional)"
              />
              <FormBox
                name="horario_mon_tut"
                placeholder="Horário de atendimento do monitor de referência (obrigatório caso insira matrícula)"
              />
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
              <FormBox
                name="cargaHoraria"
                placeholder="Carga Horária (em número)"
              />
              <FormBox name="bolsa" placeholder="Bolsa (em número)" />
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

      {/* MODAL DE INSCRIÇÃO ATUALIZADO */}
      {modalInscricaoAberto && (
        <div className="modal-backdrop">
          <div className="modal-content text-center">
            <h2 className="text-2xl font-bold mb-4">Confirmar Candidatura</h2>
            <p className="text-lg mb-6">
              Você deseja se candidatar para a vaga de{" "}
              {modalInscricaoAberto.tipo.toLowerCase()} na disciplina de <br />
              <strong>{modalInscricaoAberto.nomeDisciplina}</strong>?
            </p>

            {mensagem && (
              <div
                className={`p-3 rounded-md mb-4 ${
                  mensagem.includes("sucesso")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {mensagem}
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={fecharModalInscricao}
                className="px-6 py-2 bg-gray-300 rounded-lg"
                disabled={carregando}
              >
                Cancelar
              </button>
              <button
                onClick={handleInscricao}
                disabled={carregando || mensagem?.includes("sucesso")}
                className="px-6 py-2 bg-unbblue text-white rounded-lg disabled:bg-gray-400"
              >
                {carregando ? "Aguarde..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de comentários (sem alterações) */}
      {modalComentarioAberto && matricula && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <ChatBox
              codigoOferta={modalComentarioAberto.codigoOferta}
              matriculaAvaliador={matricula}
              matriculaAvaliado={null}
            />
            <button onClick={() => setModalComentarioAberto(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

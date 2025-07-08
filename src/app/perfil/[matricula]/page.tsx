'use client'

import Header from "@/components/header";
import ProfileBox from "@/components/profile_box";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Aluno } from "@/lib/type";
import CommentBox from "@/components/comment";
import EditModal from "@/components/edit_modal"; // Importe o seu modal existente

// Tipos para os dados que vamos buscar
type Selecao = {
  tipo_oferta: string;
  nome_disciplina: string;
  numero_turma: number;
};

type MeuComentario = {
  id_composto: any;
  comentario: string;
  nota: number;
  autor: {
    nome: string;
    matricula?: number;
  };
  monitor: {
    nome: string;
  };
};

type Candidatura = {
    codigo_oferta: number;
    tipo_oferta: string;
    nome_disciplina: string;
}

interface PerfilAlunoProps {
  params: { matricula: string };
}

export default function PerfilDiscente({ params }: PerfilAlunoProps) {
  const router = useRouter();
  const { matricula } = params;

  // Estados para os dados do perfil
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [selecoes, setSelecoes] = useState<Selecao[]>([]);
  const [meusComentarios, setMeusComentarios] = useState<MeuComentario[]>([]);
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  // Estados para os modais
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar o modal de edição
  const [editingComment, setEditingComment] = useState<MeuComentario | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingNota, setEditingNota] = useState(5);
  const [deletingComment, setDeletingComment] = useState<MeuComentario | null>(null);
  const [deletingCandidatura, setDeletingCandidatura] = useState<Candidatura | null>(null);

  // Função para buscar todos os dados da página
  const fetchData = async () => {
    try {
      const [resAluno, resSelecoes, resComentarios, resCandidaturas] = await Promise.all([
        fetch(`/api/aluno/${matricula}`),
        fetch(`/api/minhas_selecoes?matricula=${matricula}`),
        fetch(`/api/meu_comentario?matricula=${matricula}`),
        fetch(`/api/minhas_candidaturas?matricula=${matricula}`),
      ]);

      if (!resAluno.ok) throw new Error("Aluno não encontrado");
      setAluno(await resAluno.json());
      
      if (resSelecoes.ok) setSelecoes(await resSelecoes.json());
      if (resComentarios.ok) setMeusComentarios(await resComentarios.json());
      if (resCandidaturas.ok) setCandidaturas(await resCandidaturas.json());

    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao buscar dados");
    }
  };

  useEffect(() => {
    if(matricula) {
        fetchData();
    }
  }, [matricula]);

  // --- LÓGICA DE GESTÃO DE COMENTÁRIOS ---
  const handleEdit = (comentario: MeuComentario) => {
    setEditingComment(comentario);
    setEditingText(comentario.comentario);
    setEditingNota(comentario.nota);
  };
  const handleSaveEdit = async () => {
    if (!editingComment) return;
    const res = await fetch('/api/meu_comentario', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_composto: editingComment.id_composto,
        novo_comentario: editingText,
        nova_nota: editingNota,
      }),
    });
    if (res.ok) {
      setEditingComment(null);
      await fetchData();
    } else {
      alert("Erro ao salvar edição.");
    }
  };
  const handleDelete = (comentario: MeuComentario) => {
    setDeletingComment(comentario);
  };
  const handleConfirmDelete = async () => {
    if (!deletingComment) return;
    const res = await fetch('/api/meu_comentario', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_composto: deletingComment.id_composto }),
    });
    if (res.ok) {
      setDeletingComment(null);
      await fetchData();
    } else {
      alert("Erro ao apagar comentário.");
    }
  };

  // --- LÓGICA DE GESTÃO DE CANDIDATURAS ---
  const handleCancelCandidatura = async () => {
    if (!deletingCandidatura) return;
    const res = await fetch('/api/minhas_candidaturas', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            matricula_aluno: parseInt(matricula),
            codigo_oferta: deletingCandidatura.codigo_oferta
        })
    });
    if (res.ok) {
        setDeletingCandidatura(null);
        await fetchData();
    } else {
        alert("Erro ao cancelar a candidatura.");
    }
  }

  if (erro) return <p>{erro}</p>;
  if (!aluno) return <p>Carregando...</p>;

  return (
    <main>
      <Header />

      {/* RENDERIZAÇÃO CONDICIONAL DO SEU MODAL DE EDIÇÃO EXISTENTE */}
      {isEditing && (
        <EditModal 
          aluno={aluno} // Passa os dados do aluno para o modal
          matricula={matricula} 
          setEdit={setIsEditing} // Passa a função para fechar o modal
        />
      )}

      <button type="button" onClick={() => router.back()} className="absolute top-28 left-20 w-14 h-14">
        <Image src="/arrow.png" alt="Voltar" fill />
      </button>
      
      {/* O ProfileBox agora passa a função para ABRIR o modal */}
      <ProfileBox aluno={aluno} matricula={matricula} setEdit={() => setIsEditing(true)} />

      {/* SEÇÃO DE SELEÇÕES RESTAURADA */}
      <div className="relative w-262 h-auto mx-auto bg-white border-2 border-t-0 border-unblightblue">
        <h1 className="relative top-2 left-2 mb-5 font-bold">Seleções</h1>
        {selecoes.length > 0 ? (
          selecoes.map((sel, index) => (
            <div key={index} className="w-254 h-auto p-4 mx-auto mb-5 content-center bg-unbblue rounded-2xl">
              <h1 className="mx-auto w-full text-white text-3xl">
                Parabéns! Você foi selecionado para a {sel.tipo_oferta.toLowerCase()} de {sel.nome_disciplina}
                {sel.numero_turma && `, da turma ${sel.numero_turma}`}
              </h1>
            </div>
          ))
        ) : (
          <p className="text-center pb-4">Você ainda não foi selecionado para nenhuma vaga.</p>
        )}
      </div>
      
      {/* SEÇÃO DE CANDIDATURAS RESTAURADA */}
      <div className="relative w-262 h-auto mx-auto bg-white border-2 border-t-0 border-unblightblue">
        <h1 className="relative top-2 left-2 mb-5 font-bold">Minhas Candidaturas</h1>
        {candidaturas.length > 0 ? (
          candidaturas.map((cand) => (
            <div key={cand.codigo_oferta} className="w-254 h-auto p-4 mx-auto mb-5 flex justify-between items-center bg-gray-100 rounded-2xl">
              <h1 className="text-gray-800 text-2xl">
                Candidatura para {cand.tipo_oferta.toLowerCase()} de <strong>{cand.nome_disciplina}</strong>
              </h1>
              <button onClick={() => setDeletingCandidatura(cand)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                Cancelar Inscrição
              </button>
            </div>
          ))
        ) : (
          <p className="text-center pb-4">Você não possui candidaturas ativas.</p>
        )}
      </div>

      {/* SEÇÃO DE COMENTÁRIOS RESTAURADA */}
      <div className="relative w-262 h-auto mx-auto pb-5 bg-white border-2 border-y-0 border-unblightblue">
        <h1 className="relative top-2 left-2 mb-5 font-bold">Comentários</h1>
        {meusComentarios.length > 0 ? (
          meusComentarios.map((com) => (
            <CommentBox key={JSON.stringify(com.id_composto)} comentario={com} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        ) : (
          <p className="text-center pb-4">Você ainda não fez nenhum comentário.</p>
        )}
      </div>

      {/* MODAIS DE GESTÃO RESTAURADOS */}
      {editingComment && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Editar Comentário</h3>
            <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} className="w-full p-2 border rounded mb-2 h-32"/>
            <div className="mb-4">
                <label>Nota: </label>
                <input type="number" min={1} max={5} value={editingNota} onChange={(e) => setEditingNota(Number(e.target.value))} className="w-20 p-2 border rounded"/>
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={() => setEditingComment(null)} className="bg-gray-200 px-4 py-2 rounded">Cancelar</button>
              <button onClick={handleSaveEdit} className="bg-unbblue text-white px-4 py-2 rounded">Salvar</button>
            </div>
          </div>
        </div>
      )}
      {deletingComment && (
        <div className="modal-backdrop">
          <div className="modal-content text-center">
            <h3 className="text-xl font-bold mb-4">Confirmar Exclusão</h3>
            <p>Tem certeza que deseja apagar este comentário?</p>
            <p className="text-sm text-gray-500 mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setDeletingComment(null)} className="bg-gray-200 px-4 py-2 rounded">Cancelar</button>
              <button onClick={handleConfirmDelete} className="bg-red-600 text-white px-4 py-2 rounded">Apagar</button>
            </div>
          </div>
        </div>
      )}
      {deletingCandidatura && (
        <div className="modal-backdrop">
          <div className="modal-content text-center">
            <h3 className="text-xl font-bold mb-4">Cancelar Candidatura</h3>
            <p>Tem certeza que deseja cancelar sua inscrição para a vaga de {deletingCandidatura.tipo_oferta.toLowerCase()} de <strong>{deletingCandidatura.nome_disciplina}</strong>?</p>
            <div className="flex justify-center gap-4 mt-6">
              <button onClick={() => setDeletingCandidatura(null)} className="bg-gray-200 px-4 py-2 rounded">Voltar</button>
              <button onClick={handleCancelCandidatura} className="bg-red-600 text-white px-4 py-2 rounded">Sim, Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

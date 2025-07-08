'use client'

import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Professor } from "@/lib/type";
import EditModalDocente from "@/components/EditModalDocente";
import ProfileTeacher from "@/components/profile_teacher";

// Tipos para os novos dados
type Oferta = {
  codigo_oferta: number;
  tipo_oferta: string;
  nome_disciplina: string;
};

type Candidato = {
  matricula_aluno: number;
  nome_aluno: string;
  ira: number;
};

interface PerfilProfessorProps {
  params: { matricula: string };
}

export default function PerfilProfessor({ params }: PerfilProfessorProps) {
  const router = useRouter();
  const { matricula } = params;
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);

  // Novos estados para a gestão de ofertas
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [selectedOfertaId, setSelectedOfertaId] = useState<string>('');
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [isLoadingCandidatos, setIsLoadingCandidatos] = useState(false);

  // Busca os dados iniciais (professor e suas ofertas)
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [resProfessor, resOfertas] = await Promise.all([
          fetch(`/api/professor/${matricula}`),
          fetch(`/api/ofertas_professor?matricula=${matricula}`)
        ]);
        
        if (!resProfessor.ok) throw new Error("Professor não encontrado");
        setProfessor(await resProfessor.json());
        
        if (resOfertas.ok) setOfertas(await resOfertas.json());

      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro ao buscar dados");
      }
    }
    if (matricula) {
      fetchInitialData();
    }
  }, [matricula]);

  // Busca os candidatos SEMPRE que uma nova oferta for selecionada
  useEffect(() => {
    if (!selectedOfertaId) {
      setCandidatos([]);
      return;
    }
    
    async function fetchCandidatos() {
      setIsLoadingCandidatos(true);
      const res = await fetch(`/api/candidatos_oferta?codigoOferta=${selectedOfertaId}`);
      if (res.ok) {
        setCandidatos(await res.json());
      }
      setIsLoadingCandidatos(false);
    }
    fetchCandidatos();
  }, [selectedOfertaId]);

  // Função para selecionar um monitor
  const handleSelecionarMonitor = async (candidato: Candidato) => {
    const horario = prompt(`Defina o horário de atendimento para ${candidato.nome_aluno}:`, "Ex: Segundas e Quartas, 14h-16h");
    if (!horario) {
      alert("Seleção cancelada. O horário é obrigatório.");
      return;
    }

    const res = await fetch('/api/selecionar_monitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigo_oferta: parseInt(selectedOfertaId),
        matricula_aluno: candidato.matricula_aluno,
        horario: horario
      })
    });

    if (res.ok) {
      alert(`${candidato.nome_aluno} selecionado com sucesso!`);
      // Remove o candidato da lista para atualizar a UI imediatamente
      setCandidatos(prev => prev.filter(c => c.matricula_aluno !== candidato.matricula_aluno));
    } else {
      const data = await res.json();
      alert(`Erro ao selecionar: ${data.error || 'Erro desconhecido'}`);
    }
  };
  
  if (erro) return <p className="text-center text-red-500 mt-10">{erro}</p>;
  if (!professor) return <p className="text-center mt-10">Carregando...</p>;
  
  return (
    <main>
      <Header/>
      {edit && <EditModalDocente matricula={matricula} setEdit={setEdit} professor={professor} />}
      <button type="button" onClick={() => router.back()} className="absolute top-28 left-20 w-14 h-14">
        <Image src="/arrow.png" alt="Voltar" fill />
      </button>
      <ProfileTeacher professor={professor} matricula={matricula} setEdit={() => setEdit(true)}/>

      {/* SECÇÃO INTERATIVA DE GESTÃO DE OFERTAS */}
      <div className="relative w-262 h-auto mx-auto bg-white border-2 border-t-0 border-unblightblue p-6">
        <h1 className="text-2xl font-bold mb-4">Gerir Candidatos das Ofertas</h1>
        
        {ofertas.length > 0 ? (
          <>
            <label htmlFor="oferta-select" className="block mb-2 text-lg font-medium text-gray-900">Selecione uma oferta para ver os candidatos:</label>
            <select
              id="oferta-select"
              value={selectedOfertaId}
              onChange={(e) => setSelectedOfertaId(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">-- Escolha uma oferta --</option>
              {ofertas.map(oferta => (
                <option key={oferta.codigo_oferta} value={oferta.codigo_oferta}>
                  {oferta.nome_disciplina} ({oferta.tipo_oferta})
                </option>
              ))}
            </select>

            {/* Lista de Candidatos */}
            <div className="mt-6">
              {isLoadingCandidatos ? (
                <p>A carregar candidatos...</p>
              ) : selectedOfertaId && candidatos.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {candidatos.map(candidato => (
                    <li key={candidato.matricula_aluno} className="py-4 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium text-gray-900">{candidato.nome_aluno}</p>
                        <p className="text-sm text-gray-500">IRA: {candidato.ira.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => handleSelecionarMonitor(candidato)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Selecionar
                      </button>
                    </li>
                  ))}
                </ul>
              ) : selectedOfertaId && (
                <p className="text-center text-gray-500 py-4">Nenhum candidato para esta oferta.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 py-4">Você ainda não criou nenhuma oferta de monitoria ou tutoria.</p>
        )}
      </div>
    </main>
  )
}

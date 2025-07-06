import React from "react";

type Turma = {
  codigo_disciplina: string;
  nome_disciplina: string;
  numero_turma: number;
  semestre_turma: string;
  professor: string;
  matricula_professor: number;
};

type TurmaSelectProps = {
  turmas: Turma[];
  onSelect: (codigoDisciplina: string) => void;
};

const TurmaSelect: React.FC<TurmaSelectProps> = ({ turmas, onSelect }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(e.target.value);
  };

  return (
    <select
      onChange={handleChange}
      className="relative w-92 h-20 mx-20 mb-10 bg-white rounded-2xl"
    >
      <option value="">Selecionar turma</option>
      {turmas.map((turma) => (
        <option
          key={`${turma.codigo_disciplina}-${turma.numero_turma}`}
          value={turma.codigo_disciplina}
        >
          {turma.nome_disciplina} (Turma {turma.numero_turma}) -{" "}
          {turma.semestre_turma}
        </option>
      ))}
    </select>
  );
};

export default TurmaSelect;

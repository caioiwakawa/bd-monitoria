// lib/type.ts

// --- Tipos Partilhados ---
export type Curso = {
  codigo_curso: number;
  nome_curso: string;
  tb_departamento: Departamento;
};
export type Disciplina = {
  codigo_disciplina: string;
  nome_disciplina: string;
};
export type Departamento = {
  codigo_departamento: number;
  nome_departamento: string;
};

// --- Tipos de Entidades Principais ---
export type AlunoTelefone = {
    num_telefone_aluno: string;
};
export type Aluno = {
    matricula_aluno: number;
    nome_aluno: string;
    email_aluno: string;
    cpf_aluno: string;
    semestre_ingresso_aluno: string;
    ira: number;
    status_aluno: string;
    tb_curso: Curso;
    tb_aluno_telefones: AlunoTelefone[];
};

// NOVO TIPO: Telefone do Professor
export type ProfessorTelefone = {
    num_telefone_professor: string;
};

// TIPO PROFESSOR ATUALIZADO: Agora inclui os telefones e os cursos que coordena
export interface Professor {
  matricula_professor: number;
  nome_professor: string;
  email_professor: string;
  cpf_professor: string;
  data_contratacao_professor: string; // ou Date
  tb_professor_telefones: ProfessorTelefone[];
  tb_curso: Curso[]; // Um professor pode coordenar vários cursos
}

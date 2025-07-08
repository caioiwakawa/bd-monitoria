// lib/type.ts

// --- Tipos Partilhados ---

export type Curso = {
  codigo_curso: number;
  nome_curso: string;
  tb_departamento: Departamento; // Um curso tem um departamento
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

// O tipo Aluno agora inclui as suas relações (curso e telefones)
export type Aluno = {
    matricula_aluno: number;
    nome_aluno: string;
    email_aluno: string;
    cpf_aluno: string;
    semestre_ingresso_aluno: string;
    ira: number;
    status_aluno: string;
    tb_curso: Curso; // O curso agora é um objeto completo
    tb_aluno_telefones: AlunoTelefone[];
};

export interface Professor {
  matricula_professor: number;
  nome_professor: string;
  email_professor: string;
  cpf_professor: string;
  data_contratacao_professor: string; // ou Date, dependendo do seu parse
}

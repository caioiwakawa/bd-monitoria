export interface Aluno {
  matricula_aluno: number;
  nome_aluno: string;
  email_aluno: string;
  cpf_aluno: string;
  semestre_ingresso_aluno: string;
  ira: number;
  status_aluno: string;
  codigo_curso: number;
}

export interface Professor {
  matricula_professor: number;
  nome_professor: string;
  email_professor: string;
  cpf_professor: string;
  data_contratacao_professor: string; // ou Date, dependendo do seu parse
}

export type Curso = {
  codigo_curso: number;
  nome_curso: string;
};

export type Disciplina = {
  codigo_disciplina: string;
  nome_disciplina: string;
};
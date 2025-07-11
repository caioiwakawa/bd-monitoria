-- TB_Departamento
CREATE TABLE IF NOT EXISTS TB_Departamento (
  Codigo_Departamento INT PRIMARY KEY,
  Nome_Departamento VARCHAR(50) NOT NULL,
  UNIQUE (Codigo_Departamento)
);

-- TB_Professor
CREATE TABLE IF NOT EXISTS TB_Professor (
  Matricula_Professor INT PRIMARY KEY,
  CPF_Professor VARCHAR(11) NOT NULL UNIQUE,
  Nome_Professor VARCHAR(50) NOT NULL,
  Email_Professor VARCHAR(50) NOT NULL UNIQUE,
  foto_perfil BYTEA,
  Data_Contratacao_Professor DATE NOT NULL
);

-- TB_Curso
CREATE TABLE IF NOT EXISTS TB_Curso (
  Codigo_Curso INT NOT NULL,
  TB_Departamento_Codigo_Departamento INT NOT NULL,
  TB_Professor_Matricula_Coordenador INT,
  Nome_Curso VARCHAR(50) NOT NULL,
  Nivel_Curso VARCHAR(20) NOT NULL,
  Turno_Curso VARCHAR(20) NOT NULL,
  PRIMARY KEY (Codigo_Curso, TB_Departamento_Codigo_Departamento),
  UNIQUE (Codigo_Curso),
  FOREIGN KEY (TB_Departamento_Codigo_Departamento) REFERENCES TB_Departamento(Codigo_Departamento),
  FOREIGN KEY (TB_Professor_Matricula_Coordenador) REFERENCES TB_Professor(Matricula_Professor) ON DELETE SET NULL
);

-- TB_Aluno
CREATE TABLE IF NOT EXISTS TB_Aluno (
  Matricula_Aluno INT PRIMARY KEY,
  CPF_Aluno VARCHAR(11) NOT NULL UNIQUE,
  Nome_Aluno VARCHAR(50) NOT NULL,
  Email_Aluno VARCHAR(50) NOT NULL UNIQUE,
  Semestre_Ingresso_Aluno VARCHAR(10) NOT NULL,
  IRA REAL NOT NULL,
  Status_Aluno VARCHAR(15) NOT NULL,
  TB_Curso_Codigo_Curso INT NOT NULL,
  foto_perfil BYTEA,
  FOREIGN KEY (TB_Curso_Codigo_Curso) REFERENCES TB_Curso(Codigo_Curso)
);

-- TB_Aluno_Telefones
CREATE TABLE IF NOT EXISTS TB_Aluno_Telefones (
  TB_Aluno_Matricula_Aluno INT NOT NULL,
  Num_Telefone_Aluno VARCHAR(25) NOT NULL,
  PRIMARY KEY (TB_Aluno_Matricula_Aluno, Num_Telefone_Aluno),
  UNIQUE (Num_Telefone_Aluno),
  FOREIGN KEY (TB_Aluno_Matricula_Aluno) REFERENCES TB_Aluno(Matricula_Aluno) ON DELETE CASCADE
);

-- TB_Aluno_Elegivel
CREATE TABLE IF NOT EXISTS TB_Aluno_Elegivel (
  TB_Aluno_Matricula_Aluno INT PRIMARY KEY,
  FOREIGN KEY (TB_Aluno_Matricula_Aluno) REFERENCES TB_Aluno(Matricula_Aluno) ON DELETE CASCADE
);

-- TB_Aluno_Matriculado
CREATE TABLE IF NOT EXISTS TB_Aluno_Matriculado (
  TB_Aluno_Matricula_Aluno INT PRIMARY KEY,
  FOREIGN KEY (TB_Aluno_Matricula_Aluno) REFERENCES TB_Aluno(Matricula_Aluno) ON DELETE CASCADE
);

-- TB_Disciplina
CREATE TABLE IF NOT EXISTS TB_Disciplina (
  Codigo_Disciplina VARCHAR(20) NOT NULL,
  Codigo_Departamento INT NOT NULL,
  Nome_Disciplina VARCHAR(50) NOT NULL,
  PRIMARY KEY (Codigo_Disciplina, Codigo_Departamento),
  UNIQUE (Codigo_Disciplina),
  FOREIGN KEY (Codigo_Departamento) REFERENCES TB_Departamento(Codigo_Departamento)
);

-- TB_Cursou_Disciplina
CREATE TABLE IF NOT EXISTS TB_Cursou_Disciplina (
  TB_Disciplina_Codigo_Disciplina VARCHAR(20) NOT NULL,
  TB_Aluno_Elegivel_TB_Aluno_Matricula_Aluno INT NOT NULL,
  Semestre_Aprovacao VARCHAR(45) NOT NULL,
  PRIMARY KEY (TB_Disciplina_Codigo_Disciplina, TB_Aluno_Elegivel_TB_Aluno_Matricula_Aluno),
  FOREIGN KEY (TB_Disciplina_Codigo_Disciplina) REFERENCES TB_Disciplina(Codigo_Disciplina),
  FOREIGN KEY (TB_Aluno_Elegivel_TB_Aluno_Matricula_Aluno) REFERENCES TB_Aluno_Elegivel(TB_Aluno_Matricula_Aluno) ON DELETE CASCADE
);

-- TB_Turma
CREATE TABLE IF NOT EXISTS TB_Turma (
  TB_Disciplina_Codigo_Disciplina VARCHAR(20) NOT NULL,
  Numero_Turma INT NOT NULL,
  Semestre_Turma VARCHAR(20) NOT NULL,
  TB_Professor_Matricula_Professor INT,
  PRIMARY KEY (TB_Disciplina_Codigo_Disciplina, Numero_Turma, Semestre_Turma),
  FOREIGN KEY (TB_Disciplina_Codigo_Disciplina) REFERENCES TB_Disciplina(Codigo_Disciplina),
  FOREIGN KEY (TB_Professor_Matricula_Professor) REFERENCES TB_Professor(Matricula_Professor) ON DELETE SET NULL
);

-- TB_Professor_Telefones
CREATE TABLE IF NOT EXISTS TB_Professor_Telefones (
  TB_Professor_Matricula_Professor INT NOT NULL,
  Num_Telefone_Professor VARCHAR(25) NOT NULL,
  PRIMARY KEY (TB_Professor_Matricula_Professor, Num_Telefone_Professor),
  UNIQUE (Num_Telefone_Professor),
  FOREIGN KEY (TB_Professor_Matricula_Professor) REFERENCES TB_Professor(Matricula_Professor) ON DELETE CASCADE
);

-- TB_Oferta_Mon_Tut
CREATE TABLE IF NOT EXISTS TB_Oferta_Mon_Tut (
  Codigo_Oferta_Mon_Tut SERIAL PRIMARY KEY,
  Matricula_Professor_Responsavel INT NOT NULL,
  Tipo_Oferta VARCHAR(20) NOT NULL,
  Desc_Oferta VARCHAR(200) NOT NULL,
  Carga_Horaria_Oferta INT NOT NULL,
  Bolsa_Oferta REAL NOT NULL,
  FOREIGN KEY (Matricula_Professor_Responsavel) REFERENCES TB_Professor(Matricula_Professor) ON DELETE CASCADE
);

-- TB_Candidaturas_Oferta_Mon_Tut
CREATE TABLE IF NOT EXISTS TB_Candidaturas_Oferta_Mon_Tut (
  TB_Aluno_Elegivel_TB_Aluno_Matricula_Aluno INT NOT NULL,
  TB_Oferta_Mon_Tut_Codigo_Oferta_Mon_Tut INT NOT NULL,
  PRIMARY KEY (TB_Aluno_Elegivel_TB_Aluno_Matricula_Aluno, TB_Oferta_Mon_Tut_Codigo_Oferta_Mon_Tut),
  FOREIGN KEY (TB_Aluno_Elegivel_TB_Aluno_Matricula_Aluno) REFERENCES TB_Aluno_Elegivel(TB_Aluno_Matricula_Aluno) ON DELETE CASCADE,
  FOREIGN KEY (TB_Oferta_Mon_Tut_Codigo_Oferta_Mon_Tut) REFERENCES TB_Oferta_Mon_Tut(Codigo_Oferta_Mon_Tut) ON DELETE CASCADE
);

-- TB_Monitoria_Tutoria
CREATE TABLE IF NOT EXISTS TB_Monitoria_Tutoria (
  Codigo_Oferta_Mon_Tut INT NOT NULL,
  Matricula_Aluno_Monitor_Tutor INT NOT NULL,
  Horario_Mon_Tut VARCHAR(45) NOT NULL,
  PRIMARY KEY (Codigo_Oferta_Mon_Tut, Matricula_Aluno_Monitor_Tutor),
  FOREIGN KEY (Codigo_Oferta_Mon_Tut) REFERENCES TB_Oferta_Mon_Tut(Codigo_Oferta_Mon_Tut) ON DELETE CASCADE,
  FOREIGN KEY (Matricula_Aluno_Monitor_Tutor) REFERENCES TB_Aluno_Elegivel(TB_Aluno_Matricula_Aluno) ON DELETE CASCADE
);

-- TB_Matriculado_Em_Disciplina
CREATE TABLE IF NOT EXISTS TB_Matriculado_Em_Disciplina (
  TB_Aluno_Matricula INT NOT NULL,
  TB_Turma_Codigo_Disciplina VARCHAR(20) NOT NULL,
  TB_Turma_Numero_Turma INT NOT NULL,
  TB_Turma_Semestre_Turma VARCHAR(20) NOT NULL,
  PRIMARY KEY (TB_Aluno_Matricula, TB_Turma_Codigo_Disciplina, TB_Turma_Numero_Turma, TB_Turma_Semestre_Turma),
  FOREIGN KEY (TB_Aluno_Matricula) REFERENCES TB_Aluno_Matriculado(TB_Aluno_Matricula_Aluno) ON DELETE CASCADE,
  FOREIGN KEY (TB_Turma_Codigo_Disciplina, TB_Turma_Numero_Turma, TB_Turma_Semestre_Turma)
	REFERENCES TB_Turma(TB_Disciplina_Codigo_Disciplina, Numero_Turma, Semestre_Turma)
);

-- TB_Ofertas_e_Turmas
CREATE TABLE IF NOT EXISTS TB_Ofertas_e_Turmas (
  Codigo_Oferta_Mon_Tut INT NOT NULL,
  Codigo_Disciplina VARCHAR(20) NOT NULL,
  Numero_Turma INT NOT NULL,
  Semestre_Turma VARCHAR(20) NOT NULL,
  PRIMARY KEY (Codigo_Oferta_Mon_Tut, Codigo_Disciplina, Numero_Turma, Semestre_Turma),
  FOREIGN KEY (Codigo_Oferta_Mon_Tut) REFERENCES TB_Oferta_Mon_Tut(Codigo_Oferta_Mon_Tut) ON DELETE CASCADE,
  FOREIGN KEY (Codigo_Disciplina, Numero_Turma, Semestre_Turma)
	REFERENCES TB_Turma(TB_Disciplina_Codigo_Disciplina, Numero_Turma, Semestre_Turma)
);

-- TB_Avaliacao_Mon_Tut
CREATE TABLE IF NOT EXISTS TB_Avaliacao_Mon_Tut (
  Codigo_Oferta_Mon_Tut INT NOT NULL,
  Matricula_Aluno_Monitor_Tutor INT NOT NULL,
  Matricula_Aluno_Avaliador INT NOT NULL,
  Nota_Avaliacao INT NOT NULL,
  Comentario_Avaliacao VARCHAR(200) NOT NULL,
  PRIMARY KEY (Codigo_Oferta_Mon_Tut, Matricula_Aluno_Monitor_Tutor, Matricula_Aluno_Avaliador),
  FOREIGN KEY (Codigo_Oferta_Mon_Tut, Matricula_Aluno_Monitor_Tutor)
	REFERENCES TB_Monitoria_Tutoria(Codigo_Oferta_Mon_Tut, Matricula_Aluno_Monitor_Tutor) ON DELETE CASCADE,
  FOREIGN KEY (Matricula_Aluno_Avaliador)
	REFERENCES TB_Aluno_Matriculado(TB_Aluno_Matricula_Aluno) ON DELETE CASCADE
);

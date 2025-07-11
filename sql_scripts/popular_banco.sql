-- SCRIPT PARA POPULAR O BANCO DE DADOS COM DADOS DE EXEMPLO (VERSÃO EXPANDIDA)
-- A cláusula "ON CONFLICT (...) DO NOTHING" evita erros se o script for executado múltiplas vezes.

-- 1. Departamentos (5)
INSERT INTO TB_Departamento (Codigo_Departamento, Nome_Departamento) VALUES
(1, 'Ciência da Computação'),
(2, 'Matemática'),
(3, 'Física'),
(4, 'Engenharia Elétrica'),
(5, 'Letras')
ON CONFLICT (Codigo_Departamento) DO NOTHING;

-- 2. Professores (5) (foto_perfil é NULL por defeito)
INSERT INTO TB_Professor (Matricula_Professor, CPF_Professor, Nome_Professor, Email_Professor, Data_Contratacao_Professor) VALUES
(101, '11111111111', 'Dr. Alan Turing', 'alan.turing@uni.edu', '2015-03-10'),
(102, '22222222222', 'Dra. Ada Lovelace', 'ada.lovelace@uni.edu', '2016-08-22'),
(103, '33333333333', 'Dr. Isaac Newton', 'isaac.newton@uni.edu', '2010-01-05'),
(104, '44444444444', 'Dr. Nikola Tesla', 'nikola.tesla@uni.edu', '2018-11-30'),
(105, '55555555555', 'Dra. Clarice Lispector', 'clarice.lispector@uni.edu', '2012-05-15')
ON CONFLICT (Matricula_Professor) DO NOTHING;

-- 2.1 Telefones dos Professores (5)
INSERT INTO TB_Professor_Telefones (TB_Professor_Matricula_Professor, Num_Telefone_Professor) VALUES
(101, '61988881111'),
(102, '61988882222'),
(103, '61988883333'),
(104, '61988884444'),
(105, '61988885555')
ON CONFLICT (Num_Telefone_Professor) DO NOTHING;

-- 3. Cursos (5)
INSERT INTO TB_Curso (Codigo_Curso, TB_Departamento_Codigo_Departamento, TB_Professor_Matricula_Coordenador, Nome_Curso, Nivel_Curso, Turno_Curso) VALUES
(201, 1, 101, 'Ciência da Computação', 'Graduação', 'Integral'),
(202, 2, 102, 'Matemática Pura', 'Pós-Graduação', 'Matutino'),
(203, 3, 103, 'Física de Partículas', 'Mestrado', 'Integral'),
(204, 4, 104, 'Engenharia de Controle e Automação', 'Graduação', 'Noturno'),
(205, 5, 105, 'Literatura Brasileira', 'Graduação', 'Vespertino')
ON CONFLICT (Codigo_Curso, TB_Departamento_Codigo_Departamento) DO NOTHING;

-- 4. Alunos (5)
INSERT INTO TB_Aluno (Matricula_Aluno, CPF_Aluno, Nome_Aluno, Email_Aluno, Semestre_Ingresso_Aluno, IRA, Status_Aluno, TB_Curso_Codigo_Curso) VALUES
(202401, '12345678901', 'João da Silva', 'joao.silva@aluno.edu', '2024.1', 4.5, 'Ativo', 201),
(202402, '23456789012', 'Maria Oliveira', 'maria.oliveira@aluno.edu', '2024.1', 4.8, 'Ativo', 201),
(202301, '34567890123', 'Pedro Souza', 'pedro.souza@aluno.edu', '2023.1', 3.9, 'Ativo', 202),
(202202, '45678901234', 'Ana Costa', 'ana.costa@aluno.edu', '2022.2', 4.9, 'Formado', 204),
(202101, '56789012345', 'Lucas Pereira', 'lucas.pereira@aluno.edu', '2021.1', 4.2, 'Ativo', 205)
ON CONFLICT (Matricula_Aluno) DO NOTHING;

-- 5. Telefones dos Alunos (5)
INSERT INTO TB_Aluno_Telefones (TB_Aluno_Matricula_Aluno, Num_Telefone_Aluno) VALUES
(202401, '61999991111'),
(202402, '61999992222'),
(202301, '61999993333'),
(202202, '61999994444'),
(202101, '61999995555')
ON CONFLICT (Num_Telefone_Aluno) DO NOTHING;

-- 6. Marcar Alunos como Elegíveis e Matriculados (5)
INSERT INTO TB_Aluno_Elegivel (TB_Aluno_Matricula_Aluno) VALUES (202401), (202402), (202301), (202202), (202101) ON CONFLICT DO NOTHING;
INSERT INTO TB_Aluno_Matriculado (TB_Aluno_Matricula_Aluno) VALUES (202401), (202402), (202301), (202202), (202101) ON CONFLICT DO NOTHING;

-- 7. Disciplinas (5)
INSERT INTO TB_Disciplina (Codigo_Disciplina, Codigo_Departamento, Nome_Disciplina) VALUES
('CIC0001', 1, 'Algoritmos e Programação de Computadores'),
('MAT0025', 2, 'Cálculo 1'),
('FIS0050', 3, 'Física Básica 1'),
('ENE0010', 4, 'Circuitos Elétricos'),
('TEL0030', 5, 'Teoria da Literatura 1')
ON CONFLICT (Codigo_Disciplina, Codigo_Departamento) DO NOTHING;

-- 8. Histórico de Disciplinas Cursadas (5)
INSERT INTO TB_Cursou_Disciplina (TB_Disciplina_Codigo_Disciplina, TB_Aluno_Elegivel_TB_Aluno_Matricula_Aluno, Semestre_Aprovacao) VALUES
('CIC0001', 202402, '2023.2'), -- Maria já cursou APC
('MAT0025', 202402, '2023.1'), -- Maria já cursou Cálculo 1
('CIC0001', 202202, '2021.1'), -- Ana já cursou APC
('ENE0010', 202202, '2021.2'), -- Ana já cursou Circuitos
('TEL0030', 202101, '2020.1')  -- Lucas já cursou Teoria da Literatura
ON CONFLICT (TB_Disciplina_Codigo_Disciplina, TB_Aluno_Elegivel_TB_Aluno_Matricula_Aluno) DO NOTHING;

-- 9. Turmas (5)
INSERT INTO TB_Turma (TB_Disciplina_Codigo_Disciplina, Numero_Turma, Semestre_Turma, TB_Professor_Matricula_Professor) VALUES
('CIC0001', 1, '2024.1', 101),
('MAT0025', 3, '2024.1', 102),
('FIS0050', 2, '2024.1', 103),
('ENE0010', 1, '2024.1', 104),
('TEL0030', 4, '2024.1', 105)
ON CONFLICT (TB_Disciplina_Codigo_Disciplina, Numero_Turma, Semestre_Turma) DO NOTHING;

-- 10. Matricular Alunos em Disciplinas (5)
INSERT INTO TB_Matriculado_Em_Disciplina (TB_Aluno_Matricula, TB_Turma_Codigo_Disciplina, TB_Turma_Numero_Turma, TB_Turma_Semestre_Turma) VALUES
(202401, 'CIC0001', 1, '2024.1'), -- João está cursando APC
(202401, 'MAT0025', 3, '2024.1'), -- João está cursando Cálculo 1
(202301, 'MAT0025', 3, '2024.1'), -- Pedro está cursando Cálculo 1
(202402, 'FIS0050', 2, '2024.1'), -- Maria está cursando Física
(202101, 'TEL0030', 4, '2024.1')  -- Lucas está cursando Teoria da Literatura
ON CONFLICT DO NOTHING;

-- 11. Ofertas de Monitoria/Tutoria (5)
INSERT INTO TB_Oferta_Mon_Tut (Matricula_Professor_Responsavel, Tipo_Oferta, Desc_Oferta, Carga_Horaria_Oferta, Bolsa_Oferta) VALUES
(101, 'Monitoria', 'Apoio em Algoritmos e Programação de Computadores', 12, 500.00),
(102, 'Tutoria', 'Reforço em Limites e Derivadas para Cálculo 1', 10, 450.00),
(104, 'Monitoria', 'Auxílio em análise de circuitos de corrente contínua', 15, 600.00),
(103, 'Monitoria', 'Resolução de problemas de Mecânica Clássica', 12, 500.00),
(105, 'Tutoria', 'Análise de obras de Machado de Assis', 8, 400.00)
ON CONFLICT (Codigo_Oferta_Mon_Tut) DO NOTHING;

-- 12. Associar Ofertas a Turmas (5)
INSERT INTO TB_Ofertas_e_Turmas (Codigo_Oferta_Mon_Tut, Codigo_Disciplina, Numero_Turma, Semestre_Turma) VALUES
(1, 'CIC0001', 1, '2024.1'),
(2, 'MAT0025', 3, '2024.1'),
(3, 'ENE0010', 1, '2024.1'),
(4, 'FIS0050', 2, '2024.1'),
(5, 'TEL0030', 4, '2024.1')
ON CONFLICT DO NOTHING;

-- 13. Candidaturas dos Alunos às Ofertas (5)
INSERT INTO TB_Candidaturas_Oferta_Mon_Tut (TB_Aluno_Elegivel_TB_Aluno_Matricula_Aluno, TB_Oferta_Mon_Tut_Codigo_Oferta_Mon_Tut) VALUES
(202402, 1), -- Maria (já cursou APC) candidata-se à monitoria de APC
(202202, 3), -- Ana (já cursou Circuitos) candidata-se à monitoria de Circuitos
(202402, 2), -- Maria (já cursou Cálculo 1) candidata-se à tutoria de Cálculo 1
(202301, 2), -- Pedro candidata-se à tutoria de Cálculo 1
(202101, 5)  -- Lucas (já cursou Teoria) candidata-se à tutoria de Literatura
ON CONFLICT DO NOTHING;

-- 14. Selecionar Alunos para serem Monitores (5)
INSERT INTO TB_Monitoria_Tutoria (Codigo_Oferta_Mon_Tut, Matricula_Aluno_Monitor_Tutor, Horario_Mon_Tut) VALUES
(1, 202402, 'Segundas e Quartas, 16h-18h'), -- Maria selecionada para APC
(3, 202202, 'Terças e Quintas, 10h-12h'),   -- Ana selecionada para Circuitos
(5, 202101, 'Sextas, 09h-11h'),             -- Lucas selecionado para Literatura
(2, 202301, 'Quartas, 10h-12h'),            -- Pedro selecionado para Cálculo 1
(4, 202402, 'Segundas, 10h-12h')             -- Maria também selecionada para Física
ON CONFLICT DO NOTHING;

-- 15. Avaliações de Monitoria (5)
-- Adicionando matrículas para os exemplos fazerem sentido
INSERT INTO TB_Matriculado_Em_Disciplina (TB_Aluno_Matricula, TB_Turma_Codigo_Disciplina, TB_Turma_Numero_Turma, TB_Turma_Semestre_Turma) VALUES
(202401, 'ENE0010', 1, '2024.1') ON CONFLICT DO NOTHING;

INSERT INTO TB_Avaliacao_Mon_Tut (Codigo_Oferta_Mon_Tut, Matricula_Aluno_Monitor_Tutor, Matricula_Aluno_Avaliador, Nota_Avaliacao, Comentario_Avaliacao) VALUES
(3, 202202, 202401, 5, 'Excelente monitora! Muito atenciosa e domina o conteúdo.'),
(1, 202402, 202401, 4, 'A Maria explica muito bem, mas poderia ter mais horários.'),
(5, 202101, 202401, 5, 'O Lucas tem uma ótima didática para os textos.'),
(2, 202301, 202401, 3, 'O Pedro ajuda, mas às vezes parece confuso.'),
(4, 202402, 202301, 5, 'A Maria é fantástica também em Física!')
ON CONFLICT DO NOTHING;

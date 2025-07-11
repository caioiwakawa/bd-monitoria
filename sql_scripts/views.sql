------------------------------------------------- VIEW 1 --------------------------------------------------------

-- Consulta alunos que são monitores e tem IRA > 4, mas a média de avaliação como monitor é < 3

CREATE OR REPLACE VIEW vw_monitores_insatisfatorios AS
SELECT
  a.matricula_aluno,
  a.nome_aluno,
  a.ira,
  mt.codigo_oferta_mon_tut,
  mt.horario_mon_tut,
  AVG(av.nota_avaliacao)::NUMERIC(4,2) AS media_avaliacao
FROM
  tb_aluno a
JOIN
  tb_monitoria_tutoria mt
  ON a.matricula_aluno = mt.matricula_aluno_monitor_tutor
LEFT JOIN
  tb_avaliacao_mon_tut av
  ON mt.codigo_oferta_mon_tut = av.codigo_oferta_mon_tut
  AND mt.matricula_aluno_monitor_tutor = av.matricula_aluno_monitor_tutor
GROUP BY
  a.matricula_aluno,
  a.nome_aluno,
  a.ira,
  mt.codigo_oferta_mon_tut,
  mt.horario_mon_tut
HAVING
  a.ira > 4 AND AVG(av.nota_avaliacao) < 3;

SELECT * FROM vw_monitores_insatisfatorios



------------------------------------------------- VIEW 2 --------------------------------------------------------

-- Consulta monitores com IRA < 3

CREATE OR REPLACE VIEW vw_monitores_com_ira_baixo AS
SELECT DISTINCT ON (a.matricula_aluno)
  a.matricula_aluno,
  a.nome_aluno,
  a.ira,
  mt.codigo_oferta_mon_tut,
  mt.horario_mon_tut
FROM
  tb_aluno a
JOIN
  tb_monitoria_tutoria mt
  ON a.matricula_aluno = mt.matricula_aluno_monitor_tutor
WHERE
  a.ira < 3.0
ORDER BY
  a.matricula_aluno, mt.codigo_oferta_mon_tut;


SELECT * FROM vw_monitores_com_ira_baixo;

-- Procedure que recebe matrícula do aluno e verifica se a média da nota de avaliação dele é menor que 3. 
-- Caso seja, ela deleta as avaliações, deleta o monitor de qualquer relação com ofertas criadas 
-- (impossibilita avaliar), deleta as candidaturas do aluno e deleta o aluno da tabela de elegível para
-- que ele não possa se candidatar

CREATE OR REPLACE PROCEDURE remover_monitor_mau_avaliado(matricula INT)
LANGUAGE plpgsql
AS $$
DECLARE
  media_avaliacao NUMERIC;
BEGIN
  
  SELECT AVG(nota_avaliacao)
  INTO media_avaliacao
  FROM tb_avaliacao_mon_tut
  WHERE matricula_aluno_monitor_tutor = matricula;

  
  IF media_avaliacao IS NOT NULL AND media_avaliacao < 3 THEN

    
    DELETE FROM tb_avaliacao_mon_tut
    WHERE matricula_aluno_monitor_tutor = matricula;

    
    DELETE FROM tb_monitoria_tutoria
    WHERE matricula_aluno_monitor_tutor = matricula;

    
    DELETE FROM tb_candidaturas_oferta_mon_tut
    WHERE tb_aluno_elegivel_tb_aluno_matricula_aluno = matricula;

    
    DELETE FROM tb_aluno_elegivel
    WHERE tb_aluno_matricula_aluno = matricula;

  END IF;
END;
$$;

Exercício proposto na aula de javascript da Alpha EdTech com o tema de "Promises, async e await"

Descrição da atividade:


Crie uma página web para exibir a previsão do tempo de uma cidade. Essa página deve conter:

1) um select para seleção de um estado brasileiro .

2) ao selecionar um estado, uma requisição à API de localidades do IBGE (https://servicodados.ibge.gov.br/api/docs/localidades) deve ser feita, e um segundo select deverá ser preenchido com as cidades do estado selecionado.

3) ao selecionar uma cidade, devem ser mostradas ao usuário as previsões do tempo para os períodos manhã, tarde e noite do dia atual e dos próximos três dias (dados obtidos a partir de uma requisição à API de previsão do tempo do Instituto Nacional de Meteorologia - https://portal.inmet.gov.br/manual), com as seguintes informações:  data, dia da semana, ícone que represente o tempo,  resumo da previsão, temperatura mínima, temperatura máxima.

4) cada requisição às APIs deve ser feita por uma função que retorne uma Promise, que deve devolver apenas os dados necessários para a operação seguinte:

4.1) a requisição à API de localidades retorna um array para ser renderizado como options no select

4.2) a requisição à API de previsão do tempo retorna um array com os dados de previsão para cada dia, para a cidade selecionada

5) caso o retorno de qualquer consulta não contenha status 200, isto é, os dados não forem devidamente recebidos, a função deverá rejeitar (reject) o retorno, que deverá ser devidamente tratado exibindo uma mensagem de erro ao usuário 

6) as funções async/await não devem ser utilizadas nessa questão

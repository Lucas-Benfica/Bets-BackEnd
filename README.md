# Back-End para Sistema de Apostas

Bem-vindo ao repositório do back-end para o site/aplicativo de apostas. Abaixo estão as instruções para clonar, configurar e rodar o projeto, informações sobre testes e detalhes sobre as rotas disponíveis.

Link deploy:  [https://bets-api-vgd5.onrender.com/](https://bets-api-vgd5.onrender.com/).

## Clonando e Rodando o Projeto Localmente

1. Clone o repositório:

    ```bash
    git clone link-do-repositório
    cd seu-repositorio
    ```

2. Crie um arquivo `.env` seguindo as orientações fornecidas em `.env.example`.

3. Instale as dependências:

    ```bash
    npm install
    ```

4. Inicie o servidor localmente:

    ```bash
    npm run dev
    ```

Agora, o servidor estará rodando em `http://localhost:3000`. Você pode acessar a API localmente para testes.

Se preferir, você pode testar sem clonar o repositório utilizando o link do deploy: [https://bets-api-vgd5.onrender.com/](https://bets-api-vgd5.onrender.com/).

## Testando o Projeto

Para executar os testes, siga as instruções abaixo:

1. Crie um arquivo `.env.test` seguindo o mesmo modelo, mas usando um banco de testes para evitar perda de dados no banco de dados de desenvolvimento.

2. Execute os testes:

    ```bash
    npm run test
    ```

## Funcionamento e Rotas

Abaixo temos todas as rotas da API juntamente com exeplos de uso.

### POST /participants

Cria um participante com determinado saldo inicial.

#### Entrada:

```json
{
  "name": "Nome do Participante",
  "balance": 1000
}
```

#### Saída Esperada:

```json
{
  "id": 1,
  "createdAt": "string",
  "updatedAt": "string",
  "name": "Nome do Participante",
  "balance": 1000
}
```
### POST /games

Cria um novo jogo, com placar inicial 0x0 e marcado como não finalizado.

#### Entrada:

```json
{
  "homeTeamName": "Time da Casa",
  "awayTeamName": "Time Visitante"
}
```

#### Saída Esperada:
```json
{
  "id": 1,
  "createdAt": "Data + Horário",
  "updatedAt": "Data + Horário",
  "homeTeamName": "Time da Casa",
  "awayTeamName": "Time Visitante",
  "homeTeamScore": 0,
  "awayTeamScore": 0,
  "isFinished": false
}
```
### POST /bets

Cadastra uma aposta de um participante em um determinado jogo. O valor da aposta deve ser descontado imediatamente do saldo do participante.

#### Entrada:

```json
{
  "homeTeamScore": 2,
  "awayTeamScore": 1,
  "amountBet": 500,
  "gameId": 1,
  "participantId": 1
}
```
#### Saída Esperada:
```json
{
  "id": 1,
  "createdAt": "Data + Horário",
  "updatedAt": "Data + Horário",
  "homeTeamScore": 2,
  "awayTeamScore": 1,
  "amountBet": 500,
  "gameId": 1,
  "participantId": 1,
  "status": "PENDING",
  "amountWon": null
}
```
### POST /games/:id/finish

Finaliza um jogo e consequentemente atualiza todas as apostas atreladas a ele, calculando o valor ganho em cada uma e atualizando o saldo dos participantes ganhadores.

#### Entrada:

```json
{
  "homeTeamScore": 3,
  "awayTeamScore": 1
}
```
#### Saída Esperada:
```json
{
  "id": 1,
  "createdAt": "2023-11-21T12:34:56Z",
  "updatedAt": "2023-11-21T12:34:56Z",
  "homeTeamName": "Time da Casa",
  "awayTeamName": "Time Visitante",
  "homeTeamScore": 3,
  "awayTeamScore": 1,
  "isFinished": true
}
```
### GET /participants

Retorna todos os participantes e seus respectivos saldos.

#### Saída Esperada:

```json
[
  {
    "id": 1,
    "createdAt": "string",
    "updatedAt": "string",
    "name": "Nome do Participante 1",
    "balance": 1000
  },
  {
    "id": 2,
    "createdAt": "string",
    "updatedAt": "string",
    "name": "Nome do Participante 2",
    "balance": 1500
  },
]
```
### GET /games

Retorna todos os jogos cadastrados.

#### Saída Esperada:

```json
[
  {
    "id": 1,
    "createdAt": "Data + Horário",
    "updatedAt": "Data + Horário",
    "homeTeamName": "Time da Casa",
    "awayTeamName": "Time Visitante",
    "homeTeamScore": 0,
    "awayTeamScore": 0,
    "isFinished": false
  },
  {
    "id": 2,
    "createdAt": "Data + Horário",
    "updatedAt": "Data + Horário",
    "homeTeamName": "Time da Casa 2",
    "awayTeamName": "Time Visitante 2",
    "homeTeamScore": 1,
    "awayTeamScore": 2,
    "isFinished": true
  },
]
```
### GET /games/:id

Retorna os dados de um jogo junto com as apostas atreladas a ele.

#### Saída Esperada:

```json
{
  "id": 1,
  "createdAt": "Data + Horário",
  "updatedAt": "Data + Horário",
  "homeTeamName": "Time da Casa",
  "awayTeamName": "Time Visitante",
  "homeTeamScore": 0,
  "awayTeamScore": 0,
  "isFinished": false,
  "bets": [
    {
      "id": 1,
      "createdAt": "Data + Horário",
      "updatedAt": "Data + Horário",
      "homeTeamScore": 2,
      "awayTeamScore": 1,
      "amountBet": 500,
      "gameId": 1,
      "participantId": 1,
      "status": "PENDING",
      "amountWon": null
    },
    {
      "id": 2,
      "createdAt": "Data + Horário",
      "updatedAt": "Data + Horário",
      "homeTeamScore": 1,
      "awayTeamScore": 2,
      "amountBet": 750,
      "gameId": 1,
      "participantId": 2,
      "status": "WON",
      "amountWon": 1500
    },
  ]
}
```

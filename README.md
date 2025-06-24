# heavy-cards

Muito pesado

## Instalação

### Instalar `yarn` e `concurrently`

`npm install -g yarn`

`npm install -g concurrently`

### Instalar dependencias do frontend

`cd web && yarn`

## Para rodar o projeto

### Backend

`deno dev`

### Frontend

`yarn dev`

### Na pasta base do projeto

`yarn dev` vai rodar tanto o backend quanto o frontend

## Estrutura de pastas

```
├── api: Todos os arquivos do backend
│   ├── controllers: Funções que recebem o request e conversa com o a camada de dados
│   ├── data: Classes que fazem a camada de dados do firebase, Deno.KV e ServerSentEvents
│   ├── helpers: Arquivos com funções de ajuda reutilizáveis no código
│   ├── middleware: Interceptadores de request que adicionam ou checam algo
│   ├── routes: Descrição das rotas e associação aos controllers
│   ├── types: Classes e tipos usados no backend
│   ├── deno.json: O mesmo que package.json só que pro deno
│   └── main.ts: Arquivo de entry point do projeto
│
├── web: Todos os arquivos do frontend
│   ├── public: Arquivos estáticos
│   └── src: Principal pasta com todos os arquivos do projeto
│       ├── api: Clientes de api para serem reutilizados
│       ├── components: Componentes usados em toda a aplicação
│       ├── hooks: Hooks personalizados principalmente para requests pro backend
│       ├── routes: Componentes que tomam conta das rotas
│       ├── style: Definição do tema da aplicação
│       ├── types: Classes e tipos usados no frontend
│       ├── App.css: Estilo do componente principal
│       ├── App.tsx: Componente principal
│       ├── index.css: Estilo global do projeto
│       └── index.tsx: Arquivo de entry point do projeto
│
├── package.json
├── package-lock.json
└── .gitignore
```

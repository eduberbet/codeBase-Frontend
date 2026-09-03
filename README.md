# 🚀 CodigoBase — Frontend (`codigoBase-frontend`)

> Um caminho didático, prático e guiado sem bibliotecas ou frameworks: aprenda a construir uma aplicação Web completa do zero à arquitetura profissional com HTML, CSS e JavaScript nativos.

---

## 📌 Sobre o Projeto

O **CodigoBase** é um curso open-source de desenvolvimento Frontend projetado para quem quer aprender lógica e arquitetura Web construindo um projeto real, útil e divertido: um **Jogo de Plataforma e Tiro em 2D (Side-Scrolling Platformer / Shooter)**.

Em vez de exemplos abstratos, cada aula introduz uma problema ("dor") no código e apresenta o conceito que resolve esse problema de forma natural, evoluindo a aplicação passo a passo através de refatorações.

---

## 🧩 Metodologia Pedagógica

1. **Evolução Única (Sem Folder Sprawl):** O aluno mantém a mesma pasta de projeto do início ao fim do curso, vivenciando o ciclo de vida real de um software.
2. **Refatoração Guiada por Âncoras:** As instruções de alteração de código utilizam o padrão de *diffs* com **âncoras de contexto** (~3 linhas inalteradas acima e abaixo da mudança), ensinando a localização visual no editor de código.
3. **Glossário Incremental (`glossario.tech`):** Cada aula apresenta estritamente os **novos conceitos e tags**, incentivando a autonomia e o uso do repositório como material de consulta.
4. **Trinca da Web + Elementos Corporativos:** Além da mecânica de jogo (canvas/DOM, eventos de mouse/teclado, física simples), o projeto ensina **componentes nativos da Web** (inputs de texto, sliders `<input type="range">`, menus `<select>` e práticas de acessibilidade WAI-ARIA/leitores de tela).
5. **Aprofundamento Hardcore:** Todas as aulas encerram com uma seção dedicada aos bastidores da engenharia do navegador (Call Stack, Event Loop, DOM Reflow/Repaint, Curto-Circuito, Mutações na RAM e muito mais).

---

## 🎯 O Que Você Terá Construído no Final

Ao concluir as 12 aulas, você terá desenvolvido um jogo 2D completo.

### 🎮 Mecânicas do Jogo

O jogo coloca o jogador no controle de um **Herói** em uma arena contra um **Boss** altamente adaptativo.

#### 👤 O Herói
* **Personalização:** O jogador define o nome do Herói via caixa de texto (`<input>`) na tela inicial, personalizando o placar e as mensagens do jogo.
* **Ficha de 4 Atributos:**
  1. **HP Máximo (`vidaMax`):** Pontos de vida do herói.
  2. **Dano do Arco (`danoArco`):** Ataque à distância.
  3. **Dano da Faca (`danoFaca`):** Ataque corpo a corpo de alto risco.
  4. **Taxa Crítica (`chanceCritico`):** Chance de multiplicar o dano final por $2\times$.

---

#### 👾 Os 4 Arquétipos de Boss

Antes da partida, o jogador pode escolher o seu oponente via menu `<select>` ou deixar no modo **🎲 Aleatório/Surpresa**. Todos os Bosses começam no **Nível 1 com os mesmos atributos base**, mas divergem a partir da segunda rodada.

| Arquétipo | Cor Visual | Comportamento de Status | Estilo de Movimentação na Arena |
| :--- | :--- | :--- | :--- |
| **🛡️ Boss Tank** | **Verde Musgo** (`#2d572c`) | HP gigante (escala até $8.000$ HP) e Faca forte de defesa. | Patrulha vertical (Cima/Baixo). Avança no eixo X apenas se o Herói recuar. |
| **🎯 Boss Berserker** | **Vermelho Sangue** (`#990000`) | HP baixo, mas Dano de Arco e Taxa Crítica devastadores. | **Caça Ativa:** Avança no eixo X para colar no Herói e dar facadas. **Ativa *Sprint* (aceleração) se o Herói recuar.** |
| **⚖️ Boss Equilibrado** | **Roxo Padrão** (`#8257e5`) | Escalonamento em **Escadinha** intercalada dos 4 atributos. | Patrulha vertical (Cima/Baixo). Avança no eixo X apenas se o Herói recuar. |
| **🎲 Boss Caótico** | **Amarelo Dourado** (`#fba94c`) | Evolução de status e direção totalmente imprevisíveis. | Patrulha vertical (Cima/Baixo). Avança no eixo X apenas se o Herói recuar. |

---

#### 🎲 Sistema de Evolução Enviesada (90/10 com Mutação)

Conforme o jogo avança e o Boss sobe de nível, o sistema aplica um algoritmo de **Distribuição Enviesada**:
* **90% de Chance (Foco do Arquétipo):** O Boss investe os novos pontos no seu atributo principal (ex: Tank ganha HP, Berserker ganha Dano/Crítico, Equilibrado segue o próximo degrau da escadinha `HP → Arco → Faca → Crítico`).
* **10% de Chance (Mutação Inesperada):** O Boss sorteia um ponto em uma habilidade secundária ou repete o degrau anterior da escadinha, gerando surpresas no combate.

---

#### ⚔️ Regras de Combate e Provocação
* **Ataque de Faca & Provocação:** O Boss só ataca corpo a corpo (Faca) se for **provocado primeiro** por um ataque de Faca do Herói. Uma vez provocado, a flag `provocado = true` permanece ativa.
* **Exceção do Berserker:** O Boss Berserker já nasce com `provocado = true` por padrão e ataca de Faca no momento em que cola no Herói.
* **Gatilho de Recuo:** Quando o Herói recua na arena no eixo X (por exemplo, para pegar um baú de vida), os Bosses interrompem a patrulha vertical e avançam na horizontal. Se for o **Berserker**, ele ganha um impulso de velocidade (*Sprint*).

---

### ⚙️ Painel de Configurações e Acessibilidade

O jogo conta com um painel lateral/inferior para ensinar a integração de componentes nativos da Web:
* **Brilho da Arena (`<input type="range">`):** Ajusta a opacidade visual do ambiente via JS.
* **Modo Narrador (`<input type="checkbox">`):** Simula um leitor de tela e alertas sonoros/textuais para acessibilidade.
* **Seleção de Desafio (`<select>`):** Controla o tipo de Boss selecionado.

---


## 🛠️ O Que não está incluso (E Por Que)

Para garantir que você domine os **fundamentos nativos e reais do navegador**, deixamos de fora propositalmente algumas ferramentas de mercado:

- ❌ **React / Vue / Angular:** Você aprenderá como o DOM funciona de verdade antes de usar abstrações.
- ❌ **TypeScript:** Focaremos no JavaScript nativo e na entonação de sua tipagem dinâmica.
- ❌ **SASS / LESS / Tailwind:** Todo o visual é construído com CSS3 puro (Flexbox, Grid e CSS Variables).
- ❌ **HTML5 Canvas:** O jogo é renderizado manipulando elementos nativos do DOM (`<div>`, `<span>`).
- ❌ **Build Tools (Vite, Webpack, Babel):** Sem `npm install`. Basta abrir o `index.html` diretamente no navegador.
- ❌ **Classes POO Avançadas:** Usaremos Objetos Literais e Funções Puras para focar na lógica de dados sem a confusão inicial com a sintaxe de `class` ou `this`.

---

## 📖 Como Estudar Este Material

Cada pasta de aula (`/aulas/aula-XXX`) contém:
1. **`aula-XXX.md` (Apostila):**
   - **`História & A Dor:`** Por que precisamos do conceito novo.
   - **`Grossario.tech:`** Explicando as funções, sintaxes/codigos novos.
   - **`A Solução Prática:`** Explicação leve e direta para iniciantes absolutos.
   - **`Código Guia:`** Passo a passo com comentários educativos em cada linha.
   - **`🔥 Bloco Hardcore:`** Aprofundamento técnico de engenharia para quem quer atingir o nível intermediário/avançado. Facultativo para o desenvolvimento do projeto.
2. **`Código Funcional:`** Arquivos prontos para você executar, testar e modificar no seu computador.

---

## 📚 Estrutura das Aulas & Trilha do Curso

| Aula | Módulo & Tópico Principal | Conceitos Práticos (O Jogo) | 🔥 Teoria Hardcore (Aprofundamento) |
| :---: | :--- | :--- | :--- |
| **`aula-001`** | **Nascimento do Herói** | Estrutura base HTML/CSS/JS em arquivo único e o Pulo Suicida. | Event Loop, Call Stack e Reflow/Repaint do DOM. |
| **`aula-002`** | **Estruturas Condicionais** | Criação do primeiro `if/else`, sistema de cura e regras de Game Over. | Tipagem Dinâmica, Coerção de Tipos e Operadores Lógicos na memória. |
| **`aula-003`** | **Indicadores de Estado** | Manipulação do DOM e classes CSS para alterar a cor e a barra de vida. | Árvore do DOM, Especificidade do CSS e Ciclo de Renderização. |
| **`aula-004`** | **Modularização de Arquivos** | Separação das responsabilidades em `index.html`, `style.css` e `script.js`. | Importação assíncrona com `defer`, Escopo Global vs Bloco. |
| **`aula-005`** | **Controles & Eventos** | Captura de teclas (`keydown`/`keyup`) para movimentação lateral e arena. | Eventos de Entrada, Event Bubbling e Desempenho de Teclado. |
| **`aula-006`** | **Físicas & Estados** | Pulo com gravidade via timers (`setTimeout`) e agachamento com animação. | Asincronismo, Web APIs do Navegador e Throttle/Debounce. |
| **`aula-007`** | **Criação Dinâmica & Combate** | Criação de projéteis (`createElement`), tiro de arco com tempo de retenção e faca. | Remoção de Nós, Memory Leaks e Garbage Collection. |
| **`aula-008`** | **Cenário & Side-Scrolling** | Câmera lateral, renderização do cenário em blocos e liberação de memória de tiros. | Cálculo de Coordenadas Relativas e Otimização de Layouts no DOM. |
| **`aula-009`** | **Inimigos & Escalonamento** | Apresentação do Boss, atributos em objetos literais e balanceamento manual. | Referência de Objetos em Memória e Funções Puras vs Impuras. |
| **`aula-010`** | **Colisão & Coberturas** | Algoritmo de Bounding Box, destruição de caixas e cobertura contra tiros. | Geometria de Colisão 2D, Matrizes e CSS `pointer-events`. |
| **`aula-011`** | **Aleatoriedade & Refatoração** | Entrada do `Math.random()`, baús procedurais e a virada de chave Orientada a Dados. | Máquinas de Estado Finitas (FSM) e Algoritmos de Sorteio. |
| **`aula-012`** | **SPA, Interface & Persistência** | Arquitetura SPA, modais de Level Up, salvamento no `localStorage` e áudio. | History API, Web Storage, ES Modules (`import/export`) e Arquitetura de Software Web. |

---

> 🛠️ **Guia de Consulta Rápida:** Procura a explicação de um conceito específico (como *Event Loop*, *Memory Leaks* ou *Reflow*)? Acesse nosso **[`GUIA-DE-SOBREVIVENCIA.md`](./GUIA-DE-SOBREVIVENCIA.md)** para encontrar o índice direto de todas as teorias ensinadas no projeto!

> O **codeBase** é uma iniciativa educacional para ensinar engenharia e arquitetura de software de forma prática, direta e sem "mágicas".

## 🤝 Contribuições e Contato
Sugestões, correções de bugs nas apostilas ou ideias de novas mecânicas pedagógicas são sempre muito bem-vindas!

Caso queira sugerir melhorias ou contribuir com o projeto, entre em contato pelo e-mail: edu.berbet@gmail.com
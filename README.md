# 🚀 CodigoBase — Frontend (`codigoBase-frontend`)

> Um caminho didático, prático e guiado sem bibliotecas ou frameworks: aprenda a construir uma aplicação Web completa do zero à arquitetura profissional com HTML, CSS e JavaScript nativos.

---

## 📌 Sobre o Projeto

O **CodigoBase** é um curso open-source de desenvolvimento Frontend projetado para quem quer aprender lógica e arquitetura Web construindo um projeto real, útil e divertido: um **Jogo de Plataforma e Tiro em 2D (Side-Scrolling Platformer / Shooter)**.

Em vez de exemplos abstratos, cada aula introduz uma "dor" no código e apresenta o conceito que resolve esse problema de forma natural, evoluindo a aplicação passo a passo através de refatorações sucessivas.

---

## 🎯 O Que Você Terá Construído no Final

Ao concluir as 12 aulas, você terá desenvolvido um jogo Web completo contendo:

- **Herói com Mecânicas Avançadas:** Movimentação lateral com câmera *side-scrolling*, pulo com física de gravidade, ataque de faca (corpo a corpo) e ataque de arco com carregamento de força variável.
- **Sistema de Combate Complexo:** Parábolas de disparo, tiros que caem no pé se mal carregados e "flechas fantasmas desgovernada" se ultrapassarem o limite de tempo.
- **Inimigo Reativo (IA de Boss):** Um Boss com tomada de decisão temporal e reativa (máquina de estados), capaz de usar cobertura de caixas no cenário e revidar ataques no corpo a corpo.
- **Persistência de Estado:** Módulos de escolha de recompensas (cards de Level Up), baús aleatórios (positivos/negativos) e um Boss com "memória de provocação" que persiste entre as fases e no navegador (`localStorage`).
- **Arquitetura SPA Modular:** Aplicação de página única (Single Page Application) estruturada em Módulos Nativos (ES Modules) com interface responsiva, efeitos sonoros e pontuação.

---

## 🛠️ O Que NÃOOoo Está Incluso (E Por Que)

Para garantir que você domine os **fundamentos nativos e reais do navegador**, deixamos de fora propositalmente algumas ferramentas de mercado:

- ❌ **React / Vue / Angular:** Você aprenderá como o DOM funciona de verdade antes de usar abstrações.
- ❌ **TypeScript:** Focaremos no JavaScript nativo e na entonação de sua tipagem dinâmica.
- ❌ **SASS / LESS / Tailwind:** Todo o visual é construído com CSS3 puro (Flexbox, Grid e CSS Variables).
- ❌ **HTML5 Canvas:** O jogo é renderizado manipulando elementos nativos do DOM (`<div>`, `<span>`).
- ❌ **Build Tools (Vite, Webpack, Babel):** Sem `npm install`. Basta abrir o `index.html` diretamente no navegador.
- ❌ **Classes POO Avançadas:** Usaremos Objetos Literais e Funções Puras para focar na lógica de dados sem a confusão inicial com a sintaxe de `class` ou `this`.

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

## 📖 Como Estudar Este Material

Cada pasta de aula (`/aulas/aula-XXX`) contém:
1. **`aula-XXX.md` (Apostila):**
   - **História & A Dor:** Por que precisamos do conceito novo.
   - **A Solução Prática:** Explicação leve e direta para iniciantes absolutos.
   - **Código Guia:** Passo a passo com comentários educativos em cada linha.
   - **🔥 Bloco Hardcore:** Aprofundamento técnico de engenharia para quem quer atingir o nível intermediário/avançado.
2. **Código Funcional:** Arquivos prontos para você executar, testar e modificar no seu computador.

> 🛠️ **Guia de Consulta Rápida:** Procura a explicação de um conceito específico (como *Event Loop*, *Memory Leaks* ou *Reflow*)? Acesse nosso **[`GUIA-DE-SOBREVIVENCIA.md`](./GUIA-DE-SOBREVIVENCIA.md)** para encontrar o índice direto de todas as teorias ensinadas no projeto!

> O **codeBase** é uma iniciativa educacional para ensinar engenharia e arquitetura de software de forma prática, direta e sem "mágicas".
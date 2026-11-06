# codeBase: Frontend (`codeBase-frontend`)
## Aula 008 — Arquitetura de Scripts, Entidades Múltiplas e Condição de Vitória

---

### 1. Introdução: A Evolução da Nossa Arquitetura de Código

Seja bem-vindo à **`aula-008`**! 

Nas primeiras aulas do curso, todo o nosso código (HTML, CSS e JavaScript) vivia dentro de um único arquivo `.html`. Na **Aula 004**, fizemos a nossa primeira grande separação de responsabilidades: dividimos o projeto em 3 arquivos especializados (`index.html` para estrutura, `style.css` para estilo visual e `script.js` para a inteligência).

Conforme o nosso jogo cresceu — com física de pulo, gravidade, câmera de scroll, geração procedural com `Math.random()` e combate com faca —, a inteligência do nosso jogo ultrapassou 250 linhas em uma única folha!

Hoje daremos o segundo passo fundamental da Engenharia de Software: **modularizar o próprio JavaScript**.

Nesta aula, você aprenderá:
1. **Refatoração Arquitetural de JS:** Quebraremos o `script.js` em dois arquivos especializados: `entidades.js` (criação, tipos de objetos e estado do mapa) e `jogo.js` (o motor de física a 60 FPS, controle de teclas e regras de jogo).
2. **Polimento de Mecânicas (*Game Feel*):** Implementaremos a direção de olhar do Herói (`direcaoOlhar`), fazendo o golpe de faca atacar para a esquerda ou direita conforme você anda, e corrigiremos a geometria do Herói na extremidade final da pista.
3. **Diversificação de Entidades:** O mapa deixará de ter retângulos genéricos e passará a instanciar 3 tipos de objetos com comportamentos únicos:
   * **Blocos (Destruíveis / Neutros):** Barreiras retangulares que bloqueiam passagem, não dão dano e podem ser destruídas.
   * **Espinhos (Destruíveis / Perigosos):** Triângulos que causam $-20\text{ HP}$ de dano ao toque. Podem ser destruídos com a faca!
   * **Baús (Destruíveis / Recompensas):** Quadrados dourados que restauram $+30\text{ HP}$ ao serem atacados ou tocados (substituindo o botão fixo de poção).
4. **Condição de Vitória (*Win Condition*):** O jogo agora monitora a presença de perigos no mapa. Destruir todos os **Espinhos** da pista aciona a tela de **VITÓRIA**!

---

### 2. `glossario.tech` (Novidades da Aula 008)

#### 🧱 HTML & Injeção de Dependências
* **`Ordem de Declaração de Scripts`**: Declarar `<script src="entidades.js"></script>` **antes** de `<script src="jogo.js"></script>` no HTML para garantir que as funções e variáveis globais do mapa já existam na memória RAM quando o loop do jogo iniciar.

#### 🎨 CSS & Formas Geométricas
* **`Clipping / Shapes em CSS (clip-path)`**: Uso de `clip-path: polygon(...)` para transformar uma `<div>` retangular em um triângulo estilizado para os espinhos.
* **`box-sizing: border-box`**: Garante que bordas e paddings não alterem as dimensões reais calculadas para colisão da caixa delimitadora do Herói.

#### 🧠 JavaScript (Arquitetura e Estado)
* **`Direção de Olhar (Facing Direction)`**: Variável de estado (`direcaoOlhar = 1` ou `-1`) para indicar se o personagem está olhando para a direita (`1`) ou esquerda (`-1`), orientando a hitbox dos ataques.
* **`Polimorfismo Básico em Arrays`**: Iteração em um array único de objetos heterogêneos (`tipo: 'BLOCO' | 'ESPINHO' | 'BAU'`), aplicando comportamentos distintos com base em suas propriedades.
* **`Verificação de Condição de Vitória`**: Função que avalia o estado dos elementos dinâmicos e realiza a transição da Máquina de Estados Finita da SPA para a tela de `VITORIA`.

---

### 3. A Lógica da Divisão de Arquivos: De 1 a Múltiplos Módulos

Por que estamos dividindo o arquivo de script se, para o processador, ter 1 arquivo de 500 linhas ou 2 arquivos de 250 linhas dá no mesmo?

Como vimos na Aula 004: **código é escrito para SERES HUMANOS lerem e manterem!**

```
 ┌─────────────────────────────────────────────────────────┐
 │                   EVOLUÇÃO DO PROJETO                   │
 ├──────────────────────────┬──────────────────────────────┤
 │ Aula 001 - Aula 003     │ index.html (Tudo junto)      │
 ├──────────────────────────┼──────────────────────────────┤
 │ Aula 004 - Aula 007     │ index.html + style.css +     │
 │                          │ script.js                    │
 ├──────────────────────────┼──────────────────────────────┤
 │ Aula 008 (Atual)        │ index.html + style.css +     │
 │                          │ entidades.js + jogo.js       │
 └──────────────────────────┴──────────────────────────────┘
```

#### A Responsabilidade de Cada Script:

* **`entidades.js` (O Construtor e Gerenciador do Mundo):**
  Guarda as definições de como nascem os blocos, espinhos e baús. É a "fábrica" do jogo. Responsável por gerar o array de estado procedural `entidades[]`, limpar o mapa antigo e gerenciar o impacto das facadas em cada objeto.
  
* **`jogo.js` (O Motor de Física e Regras de Negócio):**
  Trata dos ouvintes de teclas de entrada, aplica a aceleração da gravidade a 60 FPS, realiza o scroll da câmera, verifica colidências, monitora a barra de vida e decide se o jogador Ganhou ou Perdeu.

---

### 4. Polimento de Gameplay (*Facing Direction* e Geometria da Arena)

#### A - Orientação da Faca (`direcaoOlhar`)
Na Aula 007, a faca nascia sempre fixada à direita do Herói (`posX + 40`). Se o jogador andasse para a esquerda (tecla `A`) e atacasse, a faca surgia nas costas do Herói!

Para resolver isso:
1. Ao pressionar `D` ou `ArrowRight`, definimos `direcaoOlhar = 1`.
2. Ao pressionar `A` ou `ArrowLeft`, definimos `direcaoOlhar = -1`.
3. No momento do ataque:
   $$\text{Se } \text{direcaoOlhar} == 1 \implies \text{facaX} = \text{posX} + 40$$
   $$\text{Se } \text{direcaoOlhar} == -1 \implies \text{facaX} = \text{posX} - 30$$

#### B - Correção do Canto Quadrado do Herói no Fim da Pista
O Herói possui `border-radius: 50%` (é um círculo). Ao encostar no limite máximo da pista em `1760px`, a borda do elemento colidia com o limite de overflow da `#arena`, "cortando" a curvatura circular e gerando um canto reto indesejado.

Ajustamos a trava limite no JS para `1755px` e aplicamos `box-sizing: border-box` no CSS, garantindo uma margem de respiro visual para o círculo continuar perfeito.

---

### 5. As 3 Entidades do Mapa e a Condição de Vitória

A pista gerada proceduralmente agora instanciará 3 tipos de objetos com dinâmicas próprias:

| Entidade | Visual | Ao Tocar com o Corpo | Ao Acertar com a Faca |
| :--- | :--- | :--- | :--- |
| **`BLOCO`** | Retângulo Cinza | Bloqueia/Obstáculo (Sem Dano) | É Destruído |
| **`ESPINHO`** | Triângulo Vermelho | Aplica $-20\text{ HP}$ de Dano | É Destruído |
| **`BAU`** | Quadrado Dourado | Abre/Restaura $+30\text{ HP}$ | Abre/Restaura $+30\text{ HP}$ |

#### 🏆 A Condição de Vitória
A cada frame ou destruição de objeto, o jogo executa a verificação:

```javascript
function verificarCondicaoVitoria() {
  let espinhosRestantes = entidades.filter(e => e.tipo === 'ESPINHO').length;
  if (espinhosRestantes === 0 && estadoJogo === 'JOGANDO') {
    encerrarJogoComVitoria();
  }
}
```

Quando o último espinho do mapa for destruído pela faca, a partida é concluída com sucesso!

---

### 6. Passo a Passo da Implementação

#### Passo 1: Atualizando a Estrutura HTML (`index.html`)
Substituímos a inclusão do script único pela importação dos dois scripts especializados no final do `<body>` e adicionamos o painel da SPA de Vitória (`#painel-vitoria`):

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>codeBase - Aula 008: Arquitetura de Scripts e Entidades Múltiplas</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- TELA 1: MENU INICIAL -->
  <div id="painel-menu">
    <h2>🎮 Configurações da Partida</h2>
    
    <div class="campo-config">
      <label for="input-nome">Nome do Herói:</label>
      <input type="text" id="input-nome" placeholder="Digite o nome..." value="Valente">
    </div>

    <div class="campo-config">
      <label for="slider-brilho">Brilho da Arena:</label>
      <input type="range" id="slider-brilho" min="0.2" max="1" step="0.1" value="1">
    </div>

    <button id="btn-iniciar" onclick="iniciarJogo()">⚔️ Iniciar Corrida</button>
  </div>

  <!-- TELA 2: HUD E ARENA -->
  <div id="hud" class="oculto">
    <span id="label-heroi">Herói: Valente</span>
    
    <div id="barra-container">
      <div id="barra-vida"></div>
    </div>
    <span id="contador-espinhos">Espinhos: 0</span>
  </div>

  <div id="arena" class="oculto">
    <div id="pista">
      <div id="heroi"></div>
      <!-- Entidades instanciadas via entidades.js -->
    </div>
  </div>

  <!-- TELA 3: GAME OVER -->
  <div id="painel-game-over" class="oculto">
    <h2>☠️ GAME OVER</h2>
    <p id="msg-derrota"></p>
    <button id="btn-reiniciar-derrota" onclick="reiniciarParaMenu()">🔄 Voltar ao Menu Inicial</button>
  </div>

  <!-- TELA 4: VITÓRIA -->
  <div id="painel-vitoria" class="oculto">
    <h2>🏆 VITÓRIA!</h2>
    <p id="msg-vitoria">Você destruiu todos os espinhos e limpou a pista!</p>
    <button id="btn-reiniciar-vitoria" onclick="reiniciarParaMenu()">🔄 Jogar Novamente</button>
  </div>

  <!-- CARREGAMENTO DOS SCRIPTS DIVIDIDOS (IMPORTANTE: entidades.js PRIMEIRO) -->
  <script src="entidades.js"></script>
  <script src="jogo.js"></script>
</body>
</html>
```

---

#### Passo 2: Estilizando as Formas Geométricas das Entidades (`style.css`)
Adicionamos no `style.css` os estilos dos blocos retangulares, espinhos triangulares (`clip-path`), baús de tesouro e o painel de vitória:

```css
/* 1. PALCO E ESTRUTURA GERAL */
* {
  box-sizing: border-box;
}

body {
  background-color: #121214;
  color: #ffffff;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
}

.oculto {
  display: none !important;
}

/* 2. PAINÉIS DA SPA (MENU, GAME OVER E VITÓRIA) */
#painel-menu, #painel-game-over, #painel-vitoria {
  background-color: #202024;
  padding: 20px 30px;
  border-radius: 8px;
  border: 1px solid #41414d;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  min-width: 300px;
}

#painel-vitoria {
  border-color: #04d361;
  box-shadow: 0 0 15px rgba(4, 211, 97, 0.3);
}

.campo-config {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

#input-nome {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #7c7c8a;
  background-color: #121214;
  color: #ffffff;
}

#btn-iniciar, #btn-reiniciar-derrota, #btn-reiniciar-vitoria {
  background-color: #8257e5;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

#btn-iniciar:hover, #btn-reiniciar-derrota:hover, #btn-reiniciar-vitoria:hover {
  background-color: #996dff;
}

/* 3. HUD */
#hud {
  margin-bottom: 15px;
  font-size: 1.1rem;
  display: flex;
  gap: 15px;
  align-items: center;
}

#barra-container {
  width: 180px;
  height: 20px;
  background-color: #41414d;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #7c7c8a;
}

#barra-vida {
  width: 100%;
  height: 100%;
  background-color: #04d361;
  transition: width 0.3s ease, background-color 0.3s ease;
}

#contador-espinhos {
  color: #e83f5b;
  font-weight: bold;
}

/* 4. ARENA E PISTA */
#arena {
  width: 600px;
  height: 300px;
  background-color: #202024;
  border: 2px solid #41414d;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  border-radius: 8px;
}

#pista {
  width: 1800px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(90deg, #202024 0%, #18181b 100%);
}

#heroi {
  width: 40px;
  height: 40px;
  background-color: #8257e5;
  border-radius: 50%;
  position: absolute;
  left: 50px;
  bottom: 20px;
  z-index: 2;
  transition: transform 0.1s ease;
}

/* 5. ENTIDADES DIVERSAS */

/* BLOCOS NEUTROS (Retângulos) */
.entidade-bloco {
  width: 40px;
  height: 50px;
  background-color: #7c7c8a;
  border: 2px solid #ffffff;
  border-radius: 4px;
  position: absolute;
  bottom: 20px;
}

/* ESPINHOS PERIGOSOS (Triângulos) */
.entidade-espinho {
  width: 40px;
  height: 45px;
  background-color: #e83f5b;
  position: absolute;
  bottom: 20px;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  filter: drop-shadow(0 0 5px rgba(232, 63, 91, 0.8));
}

/* BAÚS DE RECOMPENSA (Quadrados Dourados) */
.entidade-bau {
  width: 35px;
  height: 35px;
  background-color: #fba94c;
  border: 3px solid #ffffff;
  border-radius: 4px;
  position: absolute;
  bottom: 20px;
  box-shadow: 0 0 10px #fba94c;
}

/* ATAQUE CORPO A CORPO (FACA) */
.faca {
  width: 30px;
  height: 15px;
  background-color: #fba94c;
  border: 2px solid #ffffff;
  border-radius: 2px;
  position: absolute;
  bottom: 30px;
  z-index: 3;
  box-shadow: 0 0 10px #fba94c;
  animation: corteRapido 0.1s linear;
}

@keyframes corteRapido {
  0% { transform: scaleX(0.2); opacity: 0.5; }
  100% { transform: scaleX(1); opacity: 1; }
}
```

---

#### Passo 3: Criando o Gerenciador de Entidades (`entidades.js`)
Crie o arquivo `entidades.js`. Ele conterá as funções de geração aleatória, o array de estado global de entidades e a lógica do golpe de faca adaptado para a direção:

```javascript
// ==========================================
// ESTADO GLOBAL DAS ENTIDADES DO MAPA
// ==========================================
let entidades = [];

function gerarPosicaoAleatoria(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// GERAÇÃO PROCEDURAL DAS 3 ENTIDADES
function gerarMapaProcedural() {
  limparEntidadesAnteriores();

  let containerPista = document.getElementById("pista");
  let tipos = ['BLOCO', 'ESPINHO', 'BAU'];

  // Gera 6 entidades ao longo dos 1800px da pista
  for (let i = 0; i < 6; i++) {
    let minX = 300 + (i * 240);
    let maxX = 450 + (i * 240);
    let posX = gerarPosicaoAleatoria(minX, maxX);

    // Sorteia o tipo de objeto
    let tipoSorteado = tipos[gerarPosicaoAleatoria(0, tipos.length - 1)];

    // 1. Criação no DOM
    let el = document.createElement("div");
    el.style.left = posX + "px";

    let largura = 40;
    let altura = 50;

    if (tipoSorteado === 'BLOCO') {
      el.className = "entidade-bloco";
      largura = 40;
      altura = 50;
    } else if (tipoSorteado === 'ESPINHO') {
      el.className = "entidade-espinho";
      largura = 40;
      altura = 45;
    } else if (tipoSorteado === 'BAU') {
      el.className = "entidade-bau";
      largura = 35;
      altura = 35;
    }

    containerPista.appendChild(el);

    // 2. Registro no Array de Estado
    entidades.push({
      id: i,
      tipo: tipoSorteado,
      x: posX,
      largura: largura,
      altura: altura,
      elementoDOM: el,
      emColisao: false
    });
  }

  atualizarContadorEspinhos();
}

function limparEntidadesAnteriores() {
  for (let ent of entidades) {
    if (ent.elementoDOM) {
      ent.elementoDOM.remove();
    }
  }
  entidades = [];
}

// ATAQUE DE FACA ORIENTADO PELA DIREÇÃO DO HERÓI
function executarAtaqueFaca(posX, posY, direcaoOlhar) {
  let containerPista = document.getElementById("pista");

  // Posiciona a faca com base na direção de olhar (1: Direita, -1: Esquerda)
  let facaX = (direcaoOlhar === 1) ? (posX + 40) : (posX - 30);
  let facaLargura = 30;

  // 1. Instanciação no DOM
  let elFaca = document.createElement("div");
  elFaca.className = "faca";
  elFaca.style.left = facaX + "px";
  containerPista.appendChild(elFaca);

  // Auto-remoção em 300ms
  setTimeout(function() {
    elFaca.remove();
  }, 300);

  // 2. Colisão do Golpe com Entidades
  for (let i = entidades.length - 1; i >= 0; i--) {
    let ent = entidades[i];

    let acertouX = (facaX + facaLargura >= ent.x) && (facaX <= ent.x + ent.largura);
    let acertouY = (posY <= 20 + ent.altura);

    if (acertouX && acertouY) {
      console.log("🗡️ Faca atingiu entidade tipo: " + ent.tipo);

      if (ent.tipo === 'BAU') {
        // Baú aberto com faca restaura vida
        recomporVidaHeroi(30);
      }

      // Destrói elemento no DOM e na memória
      ent.elementoDOM.remove();
      entidades.splice(i, 1);
      
      atualizarContadorEspinhos();
      verificarCondicaoVitoria();
    }
  }
}

function atualizarContadorEspinhos() {
  let espinhos = entidades.filter(e => e.tipo === 'ESPINHO').length;
  let contador = document.getElementById("contador-espinhos");
  if (contador) {
    contador.innerText = "Espinhos: " + espinhos;
  }
}
```

---

#### Passo 4: Criando o Motor Principal (`jogo.js`)
Crie o arquivo `jogo.js`. Ele gerenciará a física contínua, as colisões por tipo de entidade e as regras de vitória e derrota:

```javascript
// ==========================================
// MÁQUINA DE ESTADOS E FÍSICA DO MOTOR
// ==========================================
let estadoJogo = 'MENU';
let nomeHeroi = "Valente";
let vida = 100;
let maxVida = 100;

// POSICIONAMENTO E VETORES 2D
let posX = 50;
let posY = 20;
let velocidadeX = 5;
let velocidadeY = 0;
let gravidade = 0.6;
let emPulo = false;
let direcaoOlhar = 1; // 1 = Direita, -1 = Esquerda

// TECLAS E INPUTS
let teclasPressionadas = {};
let inputNome = document.getElementById("input-nome");
inputNome.addEventListener("keydown", function(e) {
  e.stopPropagation();
});

window.addEventListener("keydown", function(e) {
  teclasPressionadas[e.code] = true;

  if ((e.code === "KeyJ" || e.code === "KeyF") && estadoJogo === 'JOGANDO') {
    executarAtaqueFaca(posX, posY, direcaoOlhar);
  }
});

window.addEventListener("keyup", function(e) {
  teclasPressionadas[e.code] = false;
});

let sliderBrilho = document.getElementById("slider-brilho");
sliderBrilho.addEventListener("input", function() {
  document.getElementById("arena").style.opacity = sliderBrilho.value;
});

// ==========================================
// CICLO DE VIDA E TRANSIÇÃO DE TELAS
// ==========================================
function iniciarJogo() {
  if (inputNome.value.trim() !== "") {
    nomeHeroi = inputNome.value.trim();
  }
  document.getElementById("label-heroi").innerText = "Herói: " + nomeHeroi;

  estadoJogo = 'JOGANDO';
  document.getElementById("painel-menu").classList.add("oculto");
  document.getElementById("hud").classList.remove("oculto");
  document.getElementById("arena").classList.remove("oculto");

  // Reset de Variáveis
  vida = maxVida;
  posX = 50;
  posY = 20;
  velocidadeY = 0;
  emPulo = false;
  direcaoOlhar = 1;
  atualizarBarraVida();

  // Gera novo mapa com as 3 entidades
  gerarMapaProcedural();

  requestAnimationFrame(atualizarLoopFisica);
}

// LOOP PRINCIPAL DE FÍSICA A 60 FPS
function atualizarLoopFisica() {
  if (estadoJogo !== 'JOGANDO') return;

  let elementoHeroi = document.getElementById("heroi");
  let elementoArena = document.getElementById("arena");

  // 1. MOVIMENTO E DIREÇÃO DE OLHAR
  if (teclasPressionadas["KeyD"] || teclasPressionadas["ArrowRight"]) {
    posX += velocidadeX;
    direcaoOlhar = 1;
  }
  if (teclasPressionadas["KeyA"] || teclasPressionadas["ArrowLeft"]) {
    posX -= velocidadeX;
    direcaoOlhar = -1;
  }

  // Trava de Borda da Pista (Respiro de 1755px para manter a curvatura do círculo)
  if (posX < 0) posX = 0;
  if (posX > 1755) posX = 1755;

  // 2. FÍSICA VERTICAL (PULO E GRAVIDADE)
  if ((teclasPressionadas["Space"] || teclasPressionadas["KeyW"]) && !emPulo) {
    velocidadeY = 12;
    emPulo = true;
  }

  posY += velocidadeY;
  if (emPulo) velocidadeY -= gravidade;

  if (posY <= 20) {
    posY = 20;
    velocidadeY = 0;
    emPulo = false;
  }

  // Atualiza no DOM
  elementoHeroi.style.left = posX + "px";
  elementoHeroi.style.bottom = posY + "px";

  // Câmera de Scroll Lateral
  elementoArena.scrollLeft = posX - 200;

  // Checagem de Colisão com Entidades
  processarColisoesEntidades();

  requestAnimationFrame(atualizarLoopFisica);
}

// PROCESSAMENTO DE REGRAS POR TIPO DE ENTIDADE
function processarColisoesEntidades() {
  let heroiLargura = 40;

  for (let i = entidades.length - 1; i >= 0; i--) {
    let ent = entidades[i];

    let colidiuX = (posX + heroiLargura > ent.x) && (posX < ent.x + ent.largura);
    let colidiuY = (posY < 20 + ent.altura);

    if (colidiuX && colidiuY) {
      if (!ent.emColisao) {
        ent.emColisao = true;

        if (ent.tipo === 'ESPINHO') {
          vida -= 20;
          atualizarBarraVida();
          console.log("💥 Dano de espinho! HP: " + vida);

          if (vida <= 0) {
            vida = 0;
            encerrarJogoComDerrota();
          }
        } else if (ent.tipo === 'BAU') {
          console.log("🎁 Baú aberto ao tocar! +30 HP");
          recomporVidaHeroi(30);
          ent.elementoDOM.remove();
          entidades.splice(i, 1);
        } else if (ent.tipo === 'BLOCO') {
          console.log("🧱 Encostou em um bloco neutro.");
        }
      }
    } else {
      ent.emColisao = false;
    }
  }
}

function recomporVidaHeroi(quantidade) {
  vida += quantidade;
  if (vida > maxVida) vida = maxVida;
  atualizarBarraVida();
}

function verificarCondicaoVitoria() {
  let espinhosRestantes = entidades.filter(e => e.tipo === 'ESPINHO').length;
  if (espinhosRestantes === 0 && estadoJogo === 'JOGANDO') {
    encerrarJogoComVitoria();
  }
}

function encerrarJogoComDerrota() {
  estadoJogo = 'GAME_OVER';
  document.getElementById("painel-game-over").classList.remove("oculto");
  document.getElementById("msg-derrota").innerText = "☠️ " + nomeHeroi + " sucumbiu aos perigos da arena!";
}

function encerrarJogoComVitoria() {
  estadoJogo = 'VITORIA';
  document.getElementById("painel-vitoria").classList.remove("oculto");
  document.getElementById("msg-vitoria").innerText = "🏆 PARABÉNS! " + nomeHeroi + " destruiu todos os espinhos e venceu a corrida!";
}

function reiniciarParaMenu() {
  limparEntidadesAnteriores();
  estadoJogo = 'MENU';
  document.getElementById("painel-game-over").classList.add("oculto");
  document.getElementById("painel-vitoria").classList.add("oculto");
  document.getElementById("hud").classList.add("oculto");
  document.getElementById("arena").classList.add("oculto");
  document.getElementById("painel-menu").classList.remove("oculto");
}

function atualizarBarraVida() {
  let elementoBarra = document.getElementById("barra-vida");
  let porcentagem = (vida / maxVida) * 100;
  elementoBarra.style.width = porcentagem + "%";

  if (porcentagem > 60) {
    elementoBarra.style.backgroundColor = "#04d361";
  } else if (porcentagem > 25) {
    elementoBarra.style.backgroundColor = "#fba94c";
  } else {
    elementoBarra.style.backgroundColor = "#e83f5b";
  }
}
```

---

### 7. 🔥 Aprofundamento Hardcore (Bastidores da Engenharia)

#### A - A Ordem de Injeção de Scripts no HTML (*Script Dependency Order*)
Quando o navegador processa as tags `<script src="entidades.js"></script>` e `<script src="jogo.js"></script>` sem o atributo `defer` ou `async`, ele lê e executa os arquivos **de forma estritamente síncrona na ordem em que foram declarados**.
* Se declarássemos `jogo.js` antes de `entidades.js`, o motor falharia ao tentar invocar a função `gerarMapaProcedural()` no momento do início da partida, emitindo um `Uncaught ReferenceError`.

#### B - Polimorfismo Funcional e Iteração de Arrays
Em vez de criarmos três arrays separados (`blocos[]`, `espinhos[]`, `baus[]`), mantemos uma única estrutura de lista heterogênea `entidades[]`. A diferenciação de comportamento acontece dinamicamente através do atributo `ent.tipo`. Essa abordagem simplifica a manutenção da memória RAM e prepara a arquitetura para o paradigma de Programação Orientada a Objetos (POO) ou sistemas de Componentes (ECS).

#### C - Avaliação de Condição de Vitória na FSM
A transição do estado do jogo para `VITORIA` encerra imediatamente o envio de novos quadros do `requestAnimationFrame`, pois a condicional `if (estadoJogo !== 'JOGANDO') return;` bloqueia a reexecução do loop. Isso garante economia de ciclos de CPU e impede colisão contra objetos orfãos após o término do jogo.
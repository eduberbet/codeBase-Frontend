# codeBase: Frontend (`codeBase-frontend`)
## Aula 006 — Arquitetura SPA, Física Simultânea e a Fase do Obstáculo Fixo

---

### 1. Introdução: O Bug do Digito, Física Contínua e a Pista de Obstáculo

Seja bem-vindo à **`aula-006`**! Na aula anterior, libertamos o Herói para andar com as teclas A e D. No entanto, dois problemas graves de engenharia e jogabilidade surgiram:

1. **O Bug do Digito (Conflito de Foco):** Se você tentou digitar a letra **'A'** no campo de Nome do Herói na aula passada, percebeu que o Herói saía andando para a esquerda na arena enquanto você escrevia. E a Barra de Espaço disparava um pulo no meio do formulário!
2. **Trava de Movimento Contínuo:** Se você tentava **pular (Espaço) e andar (D) ao mesmo tempo**, as teclas competiam de forma síncrona e o Herói não realizava a curva diagonal fluida.

Hoje vamos elevar a arquitetura do projeto ao padrão profissional:
1. **Estrutura SPA (*Single Page Application*):** Organizaremos o jogo em 3 telas/estados visuais (`MENU` $\rightarrow$ `JOGANDO` $\rightarrow$ `GAME_OVER`) sem recarregar a página.
2. **Isolamento de Eventos (`event.stopPropagation()`):** Travaremos a subida de eventos de teclado enquanto o jogador digita o nome.
3. **Loop de Física Real (60 FPS):** Usaremos um mapa de teclas pressionadas (`teclasPressionadas`) combinado com vetores de velocidade e gravidade (`velocidadeY` e `gravidade`).
4. **Câmera com Scroll Lateral e Obstáculo Fixo:** Expandiremos a pista para 1800px de extensão e posicionaremos um obstáculo fixo na posição 800px. O Herói perderá HP se trombar ou cair sobre ele, mas passará zerado de dano se saltar perfeitamente por cima!

---

### 2. `glossario.tech` (Novidades da Aula 006)

> 💡 *Nota: Consulte os glossários das Aulas anteriores sempre que precisar relembrar seletores, tags ou funções passadas.*

#### 🧱 HTML (Esqueleto)
* **`Arquitetura de Telas SPA`**: Estrutura em que todas as telas (`#painel-menu`, `#hud`, `#arena`, `#painel-game-over`) residem no mesmo documento HTML, sendo exibidas ou ocultadas via classe CSS.

#### 🎨 CSS (Aparência e Estilo)
* **`.oculto { display: none !important; }`**: Classe utilitária para esconder completamente elementos e remover seu impacto visual no DOM.
* **`Viewport da Arena vs. Pista Extensa`**: A `#arena` funciona como uma janela de visualização (600px com `overflow-x: hidden`), enquanto a `#pista` interna se estende por 1800px.

#### 🧠 JavaScript (Cérebro e Lógica)
* **`event.stopPropagation()`**: Método que impede um evento de teclado disparado em um elemento filho (ex: caixa de texto) de "borbulhar" (*event bubbling*) e acionar os ouvintes globais da janela (`window`).
* **`Mapa de Estado de Teclas (`teclasPressionadas[e.code] = true/false`)`**: Objeto em JS que registra quais teclas estão ativas ao mesmo tempo, permitindo pulos diagonais fluídos.
* **`Loop de Física Continuo (`requestAnimationFrame`)`**: Método nativo que executa atualizações matemáticas a 60 quadros por segundo em sincronia com a GPU do navegador.
* **`Detecção de Colisão por Caixa Delimitadora (*AABB*)`**: Algoritmo que verifica a sobreposição entre o Herói e o obstáculo nos eixos X e Y.

---

### 3. Passo a Passo da Refatoração

---

#### Passo 1: Estruturando as Telas da SPA e a Pista no HTML (`index.html`)

Abra o seu `index.html`. Vamos organizar as 3 visualizações da SPA e incluir a pista extensa com o obstáculo fixo:

```html
<body>

  <!-- TELA 1: MENU INICIAL E CONFIGURAÇÕES (SPA View 1) -->
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

  <!-- TELA 2: HUD E ARENA (SPA View 2 - Ativas em Jogo) -->
  <div id="hud" class="oculto">
    <span id="label-heroi">Herói: Valente</span>
    
    <div id="barra-container">
      <div id="barra-vida"></div>
    </div>
    
    <button id="btn-curar" onclick="curarHeroi()">Usar Poção (+25 HP)</button>
  </div>

  <!-- Viewport da Arena (600px) contendo a Pista Extensa (1800px) -->
  <div id="arena" class="oculto">
    <div id="pista">
      <div id="heroi"></div>
      <!-- Obstáculo FIXO na posição 800px -->
      <div id="obstaculo"></div>
    </div>
  </div>

  <!-- TELA 3: PAINEL DE GAME OVER (SPA View 3) -->
  <div id="painel-game-over" class="oculto">
    <h2>☠️ GAME OVER</h2>
    <p id="msg-derrota"></p>
    <button id="btn-reiniciar" onclick="reiniciarParaMenu()">🔄 Voltar ao Menu Inicial</button>
  </div>

  <script src="script.js"></script>
</body>
```
#### Passo 2: Estilizando a Viewport da Arena e o Obstáculo no CSS (style.css)
No seu style.css, insira a classe .oculto, o layout do Menu Inicial e a configuração espacial da pista e do obstáculo:
``` CSS
/* CLASSE UTILITÁRIA SPA */
.oculto {
  display: none !important;
}

/* PAINÉIS DE MENU E GAME OVER */
#painel-menu, #painel-game-over {
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

#btn-iniciar, #btn-reiniciar {
  background-color: #8257e5;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

#btn-iniciar:hover, #btn-reiniciar:hover {
  background-color: #996dff;
}

/* HUD E BARRA DE VIDA */
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

/* ARENA VIEWPORT (600px) E PISTA (1800px) */
#arena {
  width: 600px;
  height: 300px;
  background-color: #202024;
  border: 2px solid #41414d;
  position: relative;
  overflow-x: hidden; /* Rolagem controlada via JS */
  overflow-y: hidden;
  border-radius: 8px;
  transition: opacity 0.2s ease;
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
}

/* OBSTÁCULO FIXO NA PISTA */
#obstaculo {
  width: 35px;
  height: 50px;
  background-color: #e83f5b;
  border-radius: 4px;
  position: absolute;
  left: 800px; /* Posição fixa inicial */
  bottom: 20px;
  border: 2px solid #ffffff;
}
```
#### Passo 3: Implementando o Loop de Física e Solução do Bug de Foco no JS (script.js)
No arquivo script.js, insira o isolamento de eventos com stopPropagation(), o gerenciamento das telas da SPA e o loop de animação contínuo:

```JavaScript
// ==========================================
// MÁQUINA DE ESTADOS E VARIÁVEIS NA MEMÓRIA
// ==========================================
let estadoJogo = 'MENU'; // 'MENU' | 'JOGANDO' | 'GAME_OVER'
let nomeHeroi = "Valente";
let vida = 100;
let maxVida = 100;

// FÍSICA E POSICIONAMENTO 2D
let posX = 50;
let posY = 20;
let velocidadeX = 5;
let velocidadeY = 0;
let gravidade = 0.6;
let emPulo = false;

// MAPA DE TECLAS PRESSIONADAS (Eixos simultâneos)
let teclasPressionadas = {};

// DADOS DO OBSTÁCULO FIXO
let obstaculoX = 800;
let obstaculoLargura = 35;
let obstaculoAltura = 50;
let emColisao = false;

// CORREÇÃO DO BUG DO DIGITO (stopPropagation)
let inputNome = document.getElementById("input-nome");
inputNome.addEventListener("keydown", function(e) {
  e.stopPropagation(); // Impede que a digitação no input mova o herói na arena!
});

// ESCUTA CONTINUA DE TECLAS PRESSIONADAS E SOLTAS
window.addEventListener("keydown", function(e) {
  teclasPressionadas[e.code] = true;
});

window.addEventListener("keyup", function(e) {
  teclasPressionadas[e.code] = false;
});

// CONTROLE DO SLIDER DE BRILHO
let sliderBrilho = document.getElementById("slider-brilho");
sliderBrilho.addEventListener("input", function() {
  document.getElementById("arena").style.opacity = sliderBrilho.value;
});

// ==========================================
// TRANSIÇÃO DE TELAS (ARQUITETURA SPA)
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

  // Reset de física e vida
  vida = maxVida;
  posX = 50;
  posY = 20;
  velocidadeY = 0;
  emPulo = false;
  atualizarBarraVida();

  // Inicia o Loop Continuo de Física a 60 FPS
  requestAnimationFrame(atualizarLoopFisica);
}

// LOOP PRINCIPAL DE FÍSICA (60 QUADROS POR SEGUNDO)
function atualizarLoopFisica() {
  if (estadoJogo !== 'JOGANDO') return;

  let elementoHeroi = document.getElementById("heroi");
  let elementoArena = document.getElementById("arena");

  // 1. MOVIMENTAÇÃO HORIZONTAL (EIXO X)
  if (teclasPressionadas["KeyD"] || teclasPressionadas["ArrowRight"]) {
    posX += velocidadeX;
  }
  if (teclasPressionadas["KeyA"] || teclasPressionadas["ArrowLeft"]) {
    posX -= velocidadeX;
  }

  // Trava das bordas da pista (0px até 1760px)
  if (posX < 0) posX = 0;
  if (posX > 1760) posX = 1760;

  // 2. MOVIMENTAÇÃO VERTICAL E GRAVIDADE (EIXO Y)
  if ((teclasPressionadas["Space"] || teclasPressionadas["KeyW"]) && !emPulo) {
    velocidadeY = 12; // Impulso do pulo
    emPulo = true;
  }

  // Aplica força de gravidade durante o pulo
  posY += velocidadeY;
  if (emPulo) {
    velocidadeY -= gravidade;
  }

  // Colisão com o chão
  if (posY <= 20) {
    posY = 20;
    velocidadeY = 0;
    emPulo = false;
  }

  // Atualiza posições no DOM
  elementoHeroi.style.left = posX + "px";
  elementoHeroi.style.bottom = posY + "px";

  // 3. CÂMERA DE SCROLL LATERAL (Acompanha o Herói)
  elementoArena.scrollLeft = posX - 200;

  // 4. VERIFICAÇÃO DE COLISÃO COM O OBSTÁCULO
  verificarColisaoObstaculo();

  // Executa o próximo frame
  requestAnimationFrame(atualizarLoopFisica);
}

// LÓGICA DE DETECÇÃO DE DANO E COLISÃO
function verificarColisaoObstaculo() {
  let heroiLargura = 40;

  // Checa sobreposição no Eixo X e Eixo Y
  let colidiuX = (posX + heroiLargura > obstaculoX) && (posX < obstaculoX + obstaculoLargura);
  let colidiuY = (posY < 20 + obstaculoAltura); // Altura do chão até o topo do obstáculo

  if (colidiuX && colidiuY) {
    if (!emColisao) {
      emColisao = true;
      vida -= 20; // Aplica dano por bater ou cair por cima
      atualizarBarraVida();
      console.log("💥 " + nomeHeroi + " atingiu o obstáculo fixo! HP: " + vida);

      if (vida <= 0) {
        vida = 0;
        encerrarJogo();
      }
    }
  } else {
    emColisao = false; // Livre do obstáculo / pulou por cima sem encostar
  }
}

function encerrarJogo() {
  estadoJogo = 'GAME_OVER';
  document.getElementById("painel-game-over").classList.remove("oculto");
  document.getElementById("msg-derrota").innerText = "☠️ " + nomeHeroi + " colidiu no obstáculo e não resistiu!";
}

function reiniciarParaMenu() {
  estadoJogo = 'MENU';
  document.getElementById("painel-game-over").classList.add("oculto");
  document.getElementById("hud").classList.add("oculto");
  document.getElementById("arena").classList.add("oculto");
  document.getElementById("painel-menu").classList.remove("oculto");
}

function curarHeroi() {
  if (vida > 0 && vida < maxVida) {
    vida += 25;
    if (vida > maxVida) vida = maxVida;
    atualizarBarraVida();
  }
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
#### 4. Desafio Prático
No Menu Inicial, clique na caixa do nome e digite a palavra "Valente" usando espaço e as teclas A/D. Observe como o Herói não se move na arena enquanto você digita!

Na partida, corra até a posição 800px. Experimente bater direto no obstáculo para perder 20 HP, e depois reinicie a partida e tente saltar com Espaço + D antes de chegar no obstáculo para passar completamente sem dano.

### 🔥 Aprofundamento Hardcore (Bastidores da Engenharia)
#### A - A Mecânica do Borbulhamento de Eventos (Event Bubbling) e stopPropagation()
Quando pressionamos uma tecla no <input>, a árvore do DOM gera um evento que navega do elemento filho (<input>) até o elemento raiz da janela (window). Chamar event.stopPropagation() instrui a engine do JS a interromper a propagação daquele evento no meio do caminho, garantindo que o ouvinte anexado na window nunca chegue a ler aquela tecla.

#### B - O Loop Continuo (requestAnimationFrame) vs. Eventos Discretos
Separar a captura de teclado (que apenas marca teclasPressionadas[code] = true/false) do loop de atualização contínua (requestAnimationFrame) é o padrão de ouro da física de jogos. O loop roda a 60 FPS cravados pela taxa de atualização do monitor, garantindo cálculos suaves de vetores e gravidade.
# codeBase: Frontend (`codeBase-frontend`)
## Aula 007 — Geração Procedural, Invocação no DOM e Combate Corpo a Corpo (Faca)

---

### 1. Introdução: O Fim do Jogo Decorado e a Pista Dinâmica

Seja bem-vindo à **`aula-007`**! 

Na aula anterior, construímos uma pista extensa com scroll lateral e deixamos um obstáculo cravado na posição `800px`. Se você jogou aquela versão mais de duas vezes, percebeu um problema clássico de *Game Design*: **o jogo ficou previsível e chato**. Bastava memorizar a posição do retângulo vermelho para pular no momento certo e passar sem dano.

Hoje vamos transformar nosso jogo em uma experiência verdadeiramente imprevisível e dinâmica!

Nesta aula, você aprenderá:
1. **Geração Procedural de Obstáculos (`Math.random()`):** Descobriremos como posicionar múltiplos obstáculos em locais imprevisíveis a cada nova partida.
2. **Criação Dinâmica de Elementos (`document.createElement`):** Instanciaremos nós no HTML em tempo real via JavaScript.
3. **Mecânica de Ataque Corpo a Corpo (Faca):** Adicionaremos um golpe rápido de faca para destruir obstáculos que estiverem no seu caminho.
4. **Gerenciamento de Arrays de Estado:** Manteremos os elementos visuais e seus dados lógicos sincronizados na memória RAM.

---

### 2. `glossario.tech` (Novidades da Aula 007)

> 💡 *Nota: Consulte os glossários das Aulas anteriores para relembrar seletores CSS, manipulação de estado e o loop de animação.*

#### 🧱 HTML & DOM (Esqueleto)
* **`document.createElement("div")`**: Método JS que cria um novo nó/elemento HTML na memória RAM antes de anexá-lo à página.
* **`container.appendChild(novoElemento)`**: Insere um elemento recém-criado como filho de um contêiner existente no DOM.
* **`elemento.remove()`**: Remove fisicamente o nó HTML da árvore do DOM e da tela do usuário.

#### 🎨 CSS (Aparência e Animação)
* **`Animação de Golpe (.faca)`**: Estilização do corte de faca posicionado temporariamente à frente do Herói com efeito visual de impacto.
* **`Camada Dinâmica (#pista)`**: Contêiner pai que recebe e gerencia as posições relativas dos múltiplos obstáculos e golpes.

#### 🧠 JavaScript (Lógica e Matemática)
* **`Math.random()`**: Função nativa que gera um número decimal pseudoaleatório no intervalo entre `0` (inclusivo) e `1` (exclusivo).
* **`Math.floor()`**: Arredonda um número decimal para baixo, retornando o número inteiro mais próximo.
* **`Array de Estado (`obstaculos[]`)`**: Estrutura de dados que armazena a lista de objetos contendo as coordenadas e referências de cada obstáculo ativo.
* **`setTimeout(callback, tempoMs)`**: Executa uma função após um período de tempo determinado (usado para remover a faca da tela após 300ms).

---

### 3. Por que o Computador Não Sabe "Sortear"? (A Magia do `Math.random`)

Na Aula 006, nosso obstáculo estava fixo na posição `800px` Para criar um desafio de verdade, precisamos de **imprevisibilidade**. Mas aqui revelamos um segredo fundamental da ciência da computação:

> 🎲 **O Computador é uma Máquina Determinística!**
> Processadores não têm intuição e não conseguem "jogar um dado" do nada. Se você pedir a um computador para gerar um número aleatório puro sem instruções, ele falhará.

#### Como o `Math.random()` Funciona?

O motor JavaScript do navegador (como o V8) utiliza algoritmos chamados **PRNG (*Pseudorandom Number Generators*)**. Ele pega uma "semente" baseada nos milissegundos do relógio interno do processador e aplica uma fórmula matemática que devolve um decimal entre `0` e `0.99999...`

Para transformar esse decimal em uma coordenada válida na pista (por exemplo, entre `400px` e `1600px`), usamos a **Fórmula de Normalização por Intervalo**:

```javascript
function gerarPosicaoAleatoria(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
Math.random() * (max - min + 1): Escala o valor decimal de 0 a 1 para o tamanho do nosso intervalo.

+ min: Desloca o resultado para que ele comece a partir da posição mínima desejada.

Math.floor(): Arredonda os decimais para baixo, gerando um número inteiro perfeito para o CSS.
```

### 4. O Ciclo de Vida da Faca: Instanciação, Hitbox e Limpeza
Pular nem sempre será suficiente para desviar dos múltiplos obstáculos espalhados pela pista. Por isso, implementaremos o Ataque de Faca (Tecla J ou F).

O ciclo de vida da faca é curto e preciso:

[ Invocação (Tecla J) ] ➔ [ Instanciação no DOM ] ➔ [ Checagem de Hitbox ] ➔ [ Destruição (300ms) ]
Nascimento: Quando o jogador ataca, uma <div class="faca"> nasce no DOM exatamente à frente do Herói (posX + 40px).

Colisão / Hitbox: Verificamos no array de obstáculos se algum elemento está dentro da área de alcance da faca.

Destruição do Obstáculo: Se acertar, o obstáculo é removido do DOM (obstaculo.elementoDOM.remove()) e retirado do array de memória RAM.

Auto-limpeza: Após 300ms, a faca é removida do DOM para não poluir a tela.

5. Passo a Passo da Refatoração
Passo 1: Atualizando o HTML (index.html)
No arquivo index.html, o obstáculo fixo <div id="obstaculo"></div> foi removido[cite: 1, 2]. Agora a #pista nascerá limpa e receberá os elementos dinâmicos via JavaScript[cite: 1, 2]:

```HTML
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>codeBase - Aula 007: Geração Procedural e Combate com Faca</title>
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
    
    <button id="btn-curar" onclick="curarHeroi()">Usar Poção (+25 HP)</button>
  </div>

  <div id="arena" class="oculto">
    <div id="pista">
      <div id="heroi"></div>
      <!-- Os obstáculos e ataques de faca serão injetados aqui via JS -->
    </div>
  </div>

  <!-- TELA 3: GAME OVER -->
  <div id="painel-game-over" class="oculto">
    <h2>☠️ GAME OVER</h2>
    <p id="msg-derrota"></p>
    <button id="btn-reiniciar" onclick="reiniciarParaMenu()">🔄 Voltar ao Menu Inicial</button>
  </div>

  <script src="script.js"></script>
</body>
</html>
```
Passo 2: Estilizando Obstáculos Dinâmicos e o Efeito da Faca (style.css)
Adicione ao style.css as regras visuais para a classe genérica .obstaculo e o efeito visual do golpe .faca:

```CSS
/* 1. PALCO E ALINHAMENTO */
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

/* 2. PAINÉIS DE MENU E GAME OVER */
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

/* 3. HUD E BARRA DE VIDA */
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

#btn-curar {
  background-color: #04d361;
  color: #000000;
  border: none;
  padding: 8px 16px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
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
}

/* OBSTÁCULOS GERADOS DINAMICAMENTE */
.obstaculo {
  width: 35px;
  height: 50px;
  background-color: #e83f5b;
  border-radius: 4px;
  position: absolute;
  bottom: 20px;
  border: 2px solid #ffffff;
  box-shadow: 0 0 8px rgba(232, 63, 91, 0.5);
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
Passo 3: Implementando a Geração Procedural e o Ataque de Faca (script.js)
No arquivo script.js, adicionamos a função gerarObstaculosProcedurais(), o array de gerenciamento de estado e a escuta da tecla de ataque (KeyJ / KeyF):

```JavaScript
// ==========================================
// MÁQUINA DE ESTADOS E VARIÁVEIS NA MEMÓRIA
// ==========================================
let estadoJogo = 'MENU';
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

// MAPA DE TECLAS PRESSIONADAS
let teclasPressionadas = {};

// ARRAY DE ESTADO DE OBSTÁCULOS DINÂMICOS
let obstaculos = [];

// ISOLAMENTO DE INPUT DE TEXTO
let inputNome = document.getElementById("input-nome");
inputNome.addEventListener("keydown", function(e) {
  e.stopPropagation();
});

// CAPTURA DE TECLAS E ATAQUE DE FACA
window.addEventListener("keydown", function(e) {
  teclasPressionadas[e.code] = true;

  // Disparo de ataque de Faca nas teclas 'J' ou 'F'
  if ((e.code === "KeyJ" || e.code === "KeyF") && estadoJogo === 'JOGANDO') {
    atacarComFaca();
  }
});

window.addEventListener("keyup", function(e) {
  teclasPressionadas[e.code] = false;
});

// SLIDER DE BRILHO
let sliderBrilho = document.getElementById("slider-brilho");
sliderBrilho.addEventListener("input", function() {
  document.getElementById("arena").style.opacity = sliderBrilho.value;
});

// ==========================================
// GERAÇÃO PROCEDURAL (Math.random)
// ==========================================
function gerarPosicaoAleatoria(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gerarObstaculosProcedurais(quantidade) {
  limparObstaculosAnteriores();

  let containerPista = document.getElementById("pista");

  for (let i = 0; i < quantidade; i++) {
    // Garante distância mínima entre cada obstáculo gerado
    let minX = 400 + (i * 350);
    let maxX = 600 + (i * 350);
    let posicaoX = gerarPosicaoAleatoria(minX, maxX);

    // 1. Cria o elemento dinâmico no DOM
    let elObstaculo = document.createElement("div");
    elObstaculo.className = "obstaculo";
    elObstaculo.style.left = posicaoX + "px";
    containerPista.appendChild(elObstaculo);

    // 2. Registra o objeto no array de estado
    obstaculos.push({
      id: i,
      x: posicaoX,
      largura: 35,
      altura: 50,
      elementoDOM: elObstaculo,
      emColisao: false
    });
  }
}

function limparObstaculosAnteriores() {
  // Remove nós do DOM e limpa o array da memória RAM
  for (let obs of obstaculos) {
    if (obs.elementoDOM) {
      obs.elementoDOM.remove();
    }
  }
  obstaculos = [];
}

// ==========================================
// SISTEMA DE ATAQUE CORPO A CORPO (FACA)
// ==========================================
function atacarComFaca() {
  let containerPista = document.getElementById("pista");

  // Coordenadas e alcance do golpe de faca
  let facaX = posX + 40; // Nasce logo à frente do Herói
  let facaLargura = 30;
  let alcanceGolpe = facaX + facaLargura;

  // 1. Instanciação visual no DOM
  let elFaca = document.createElement("div");
  elFaca.className = "faca";
  elFaca.style.left = facaX + "px";
  containerPista.appendChild(elFaca);

  // 2. Destruição visual após 300ms
  setTimeout(function() {
    elFaca.remove();
  }, 300);

  // 3. Checagem de colisão do golpe contra os obstáculos
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    let obs = obstaculos[i];

    // Verifica se a faca alcança a borda do obstáculo
    let acertouX = (alcanceGolpe >= obs.x) && (facaX <= obs.x + obs.largura);
    let acertouY = (posY <= 20 + obs.altura);

    if (acertouX && acertouY) {
      console.log("🗡️ Obstáculo destruído com a faca na posição: " + obs.x + "px!");
      
      // Remove do DOM
      obs.elementoDOM.remove();
      
      // Remove da memória RAM (Array)
      obstaculos.splice(i, 1);
    }
  }
}

// ==========================================
// TRANSIÇÃO DE TELAS E LOOP DE FÍSICA
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

  // Reset de estado
  vida = maxVida;
  posX = 50;
  posY = 20;
  velocidadeY = 0;
  emPulo = false;
  atualizarBarraVida();

  // Gera 3 obstáculos procedurais ao longo da pista
  gerarObstaculosProcedurais(3);

  requestAnimationFrame(atualizarLoopFisica);
}

function atualizarLoopFisica() {
  if (estadoJogo !== 'JOGANDO') return;

  let elementoHeroi = document.getElementById("heroi");
  let elementoArena = document.getElementById("arena");

  // Movimentação Horizontal
  if (teclasPressionadas["KeyD"] || teclasPressionadas["ArrowRight"]) posX += velocidadeX;
  if (teclasPressionadas["KeyA"] || teclasPressionadas["ArrowLeft"]) posX -= velocidadeX;

  if (posX < 0) posX = 0;
  if (posX > 1760) posX = 1760;

  // Movimentação Vertical e Gravidade
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

  // Atualiza Posição no DOM
  elementoHeroi.style.left = posX + "px";
  elementoHeroi.style.bottom = posY + "px";

  // Câmera de Scroll
  elementoArena.scrollLeft = posX - 200;

  // Verifica Colisão com Todos os Obstáculos Ativos
  verificarColisoesObstaculos();

  requestAnimationFrame(atualizarLoopFisica);
}

function verificarColisoesObstaculos() {
  let heroiLargura = 40;

  for (let obs of obstaculos) {
    let colidiuX = (posX + heroiLargura > obs.x) && (posX < obs.x + obs.largura);
    let colidiuY = (posY < 20 + obs.altura);

    if (colidiuX && colidiuY) {
      if (!obs.emColisao) {
        obs.emColisao = true;
        vida -= 20;
        atualizarBarraVida();
        console.log("💥 " + nomeHeroi + " colidiu no obstáculo em " + obs.x + "px! HP: " + vida);

        if (vida <= 0) {
          vida = 0;
          encerrarJogo();
        }
      }
    } else {
      obs.emColisao = false;
    }
  }
}

function encerrarJogo() {
  estadoJogo = 'GAME_OVER';
  document.getElementById("painel-game-over").classList.remove("oculto");
  document.getElementById("msg-derrota").innerText = "☠️ " + nomeHeroi + " não resistiu aos obstáculos da arena!";
}

function reiniciarParaMenu() {
  limparObstaculosAnteriores();
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

### 6. 🔥 Aprofundamento Hardcore (Bastidores da Engenharia)
#### A - Remoção Física vs. Remoção Lógica (DOM vs. Memória RAM)
A remoção de um elemento dinâmico no jogo exige dois passos obrigatórios:

Remoção Física (DOM): Chamamos elemento.remove() para apagar a representação visual da árvore do HTML.

Remoção Lógica (Memória): Removemos o objeto do array JavaScript via .splice(i, 1).

⚠️ Atenção: Se você apagar o elemento apenas da tela com .remove(), mas esquecer o objeto no array obstaculos[], o loop de física (requestAnimationFrame) continuará calculando colisões a 60 FPS contra um obstáculo fantasma invisível!

#### B - Vazamentos de Memória (Memory Leaks) e Nós Detachados
Quando criamos elementos dinamicamente com document.createElement(), o navegador aloca blocos na memória RAM. Se gerarmos centenas de facas ou obstáculos sem destruir suas referências no código, criamos os chamados Nós Detachados (Detached DOM Nodes). A memória consumida pela página crescerá continuamente até travar a aba do navegador (Memory Leak Crash).

#### C - O Coletor de Lixo (Garbage Collector) do Motor V8
O V8 utiliza um algoritmo de gerenciamento de memória chamado Mark-and-Sweep (Marcar e Varrer):

Marking: O motor parte da raiz global (window) e percorre todas as variáveis ativas. Todos os objetos acessíveis recebem uma marca.

Sweeping: O motor varre a memória RAM. Qualquer objeto que não tenha nenhum ponteiro/referência ativa apontando para ele é sumariamente destruído, liberando bytes no sistema operacional.

Ao fazer obs.elementoDOM.remove() e limpar a posição do array com obstaculos.splice(i, 1), cortamos todas as pontes de acesso ao objeto. O Garbage Collector identifica o item órfão e limpa a memória RAM automaticamente.
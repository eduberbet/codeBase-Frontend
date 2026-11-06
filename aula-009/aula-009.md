# codeBase: Frontend (`codeBase-frontend`)
## Aula 009 — Acessibilidade de UI, Seleção de Dificuldade, Rejogabilidade e Ataque Mergulhado (Pound Down)

---

### 1. Introdução: Customização de Partida, Game Feel e Rejogabilidade

Seja bem-vindo à **`aula-009`**! 

Na aula anterior, dividimos o coração do nosso jogo em dois arquivos JS especializados (`entidades.js` e `jogo.js`), criamos objetos interativos (blocos, espinhos e baús) e estabelecemos a nossa primeira condição de vitória.

Agora, vamos elevar a experiência do jogador (*User Experience*). Nesta aula, abordaremos:

1. **UX/UI e Acessibilidade (A11y):** Seleção dinâmica de temas de contraste visual (Padrão Cyber, Alto Contraste para acessibilidade e Retrô Arcade).
2. **Seleção de Dificuldade e Escalabilidade:** Controle procedural da quantidade de espinhos no mapa (Fácil: 3, Normal: 5, Difícil: 7).
3. **Mecânica Avançada de Combate (*Pound Down* / Ataque Mergulhado):** Golpe aéreo rápido acionado ao pressionar a tecla de direção para baixo (`S`/`ArrowDown`) junto com a faca enquanto estiver no ar.
4. **Sistema de Pontuação com Regra Oculta (*Easter Egg Bonus*):** Um sistema de pontos onde o valor base por espinho é rateado pela dificuldade, mas destruir entidades utilizando o novo ataque mergulhado confere o dobro de pontos!
5. **Limpeza de Instâncias em Tempo Real:** Garantia de que novos cliques de ataque limpem as facas anteriores instantaneamente, eliminando acúmulo visual no DOM durante a corrida frenética.
6. **Rejogabilidade Infinita:** Geração de mapas inteiramente novos a cada reinicialização da partida.

---

### 2. `glossario.tech` (Novidades da Aula 009)

#### 🧱 HTML & DOM (Acessibilidade e Inputs)
* **`<select>` & `<option>`**: Elementos de formulário HTML utilizados para criar menus suspensos de escolha de temas e dificuldades.
* **`document.body.className`**: Propriedade JS que permite alterar a classe global da aplicação para trocar os temas visuais instantaneamente.

#### 🎨 CSS (Acessibilidade & Animações Aéreas)
* **`CSS Variables / Utility Themes`**: Reutilização de variáveis de cores para aplicar paletas de Alto Contraste (fundo escuro com alto contraste amarelo/branco) e Retrô Arcade.
* **`Animação .faca-down`**: Estilização vertical do golpe direcionado para baixo durante o mergulho aéreo.

#### 🧠 JavaScript (Lógica, Física e Inputs Combinados)
* **Input Chaining (Entrada Combinada):** Leitura simultânea da tecla de pulo/ar + tecla para baixo + tecla de ataque.
* **Velocidade Terminal Aumentada (`velocidadeY` Negativa):** Impulso vertical para baixo acelerando a queda do Herói durante o ataque mergulhado.
* **Rateio de Pontuação:** Distribuição da pontuação total da fase dividida pela quantidade de espinhos sorteados.
* **Sobrescrita do DOM (`querySelector` + `.remove()`):** Busca e destruição de facas ativas anteriores antes da criação de um novo golpe.

---

### 3.0 🧱 Seção Especial: O Debugger de Colisão Sólida (Resolução de Bloqueio)

Na aula anterior, percebemos um comportamento "fantasmagórico": o Herói conseguia andar em linha reta e atravessar os blocos cinzas como se eles fossem apenas enfeites visuais. Na engenharia de jogos, objetos estáticos de cenário precisam ter volume físico sólido.

#### O Problema da Atravessação (Ghost Collisions)
Verificar apenas se o personagem tocou no objeto (colidiuX e colidiuY) serve perfeitamente para danos (como nos espinhos) ou para coleta (como nos baús). Porém, para blocos neutros, o motor precisa impedir que a coordenada posX do Herói continue avançando para dentro da matriz do obstáculo.

#### A Solução: Resolução de Impeditivos (Collision Resolution)
Para fazer o Herói "empacar" no bloco, implementamos uma checagem preditiva no loop de 60 FPS logo após atualizar a posição horizontal. Se a caixa delimitadora do Herói interceptar o bloco, travamos a posição exata dele na borda do objeto de acordo com a direção em que ele estava andando (direcaoOlhar):

```JavaScript
function resolverColisaoFisicaBlocos() {
  let heroiLargura = 40;
  let heroiAltura = 40;

  for (let ent of entidades) {
    // Apenas blocos funcionam como paredes físicas sólidas
    if (ent.tipo === 'bloco') {
      let colidiuX = (posX + heroiLargura > ent.x) && (posX < ent.x + ent.largura);
      let colidiuY = (posY < 20 + ent.altura) && (posY + heroiAltura > 20);

      if (colidiuX && colidiuY) {
        // Se vinha andando para a direita -> trava a posição na borda esquerda do bloco
        if (direcaoOlhar === 1 && (posX + heroiLargura - velocidadeX <= ent.x)) {
          posX = ent.x - heroiLargura;
        } 
        // Se vinha andando para a esquerda -> trava a posição na borda direita do bloco
        else if (direcaoOlhar === -1 && (posX + velocidadeX >= ent.x + ent.largura)) {
          posX = ent.x + ent.largura;
        }
      }
    }
  }
}
```
---
### 3. Acessibilidade Visual e UX: Por que dar Escolha ao Jogador?

Acessibilidade não é um recurso secundário (*feature* extra); é um pilar fundamental da engenharia de software moderno.

Ao disponibilizar **Temas de Contraste** no menu inicial, garantimos que pessoas com baixa visão, daltonismo ou sensibilidade à luz possam jogar confortavelmente:

* **Padrão (Cyber Dark):** Visual em tons roxos e escuros com destaques neons.
* **Alto Contraste (High Contrast / A11y):** Fundo preto puro (`#000000`), texto amarelo brilhante (`#ffff00`) e elementos com contornos nítidos e demarcados.
* **Retrô Arcade (Classic 80s):** Paleta inspirada nos consoles de 8 bits com azul marinho e tons em ciano.

---

### 4. O Ataque Mergulhado para Baixo (*Pound Down*) e a Pontuação Invertida

#### A Física do Mergulho
Quando o jogador está no ar (`emPulo === true`) e aciona simultaneamente:
$$\text{Tecla Para Baixo } (\texttt{KeyS} / \texttt{ArrowDown}) + \text{Tecla de Ataque } (\texttt{KeyJ} / \texttt{KeyF})$$

O motor altera o vetor vertical instantaneamente:
$$\text{velocidadeY} = -16$$

O Herói despenca rapidamente em direção ao chão e a `<div class="faca-down">` nasce na parte inferior do círculo do Herói.

```
      [ HERÓI ] (No ar)
          │
          ▼  (velocidadeY = -16)
       [ FACA ] (Apontada para baixo)
          │
          ▼
   ▲▲▲ ESPINHOS ▲▲▲  ➔ [ DESTRUIÇÃO + PONTOS EM DOBRO! ]
```

#### A Regra de Pontuação Invertida e o Bônus Escondido
1. **Pontuação Rateada por Dificuldade:** A pontuação total máxima da fase ($1000\text{ pts}$) é distribuída pela quantidade de espinhos do mapa:
   * **Fácil (3 Espinhos):** $1000 / 3 \approx 333\text{ pts}$ por espinho.
   * **Normal (5 Espinhos):** $1000 / 5 = 200\text{ pts}$ por espinho.
   * **Difícil (7 Espinhos):** $1000 / 7 \approx 142\text{ pts}$ por espinho.
2. **O Bônus Secreto (*Easter Egg*):** Se o espinho for destruído com um golpe de faca normal, o jogador ganha o valor base. Porém, se o espinho for destruído usando o **Ataque Mergulhado para Baixo**, a pontuação cobrada naquele espinho é **DOBRADA**!

---

### 5. Passo a Passo da Refatoração

#### Passo 1: HTML Com Seletores de UI (`index.html`)

Atualizamos o formulário do menu principal para incluir a seleção de Tema Visual e Dificuldade da Partida, além de um placar de Pontuação no HUD:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>codeBase - Aula 009: Acessibilidade, Dificuldade e Ataque Mergulhado</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="tema-padrao">

  <!-- TELA 1: MENU INICIAL -->
  <div id="painel-menu">
    <h2>🎮 Configurações da Partida</h2>
    
    <div class="campo-config">
      <label for="input-nome">Nome do Herói:</label>
      <input type="text" id="input-nome" placeholder="Digite o nome..." value="Valente">
    </div>

    <div class="campo-config">
      <label for="select-tema">Tema de Contraste (A11y):</label>
      <select id="select-tema">
        <option value="tema-padrao">Padrão (Cyber Dark)</option>
        <option value="tema-alto-contraste">Alto Contraste (Acessibilidade)</option>
        <option value="tema-retro">Retrô Arcade</option>
      </select>
    </div>

    <div class="campo-config">
      <label for="select-dificuldade">Dificuldade:</label>
      <select id="select-dificuldade">
        <option value="facil">Fácil (3 Espinhos)</option>
        <option value="normal" selected>Normal (5 Espinhos)</option>
        <option value="dificil">Difícil (7 Espinhos)</option>
      </select>
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

    <span id="label-pontos">Pontos: 0</span>
  </div>

  <div id="arena" class="oculto">
    <div id="pista">
      <div id="heroi"></div>
    </div>
  </div>

  <!-- TELA 3: GAME OVER -->
  <div id="painel-game-over" class="oculto">
    <h2>☠️ GAME OVER</h2>
    <p id="msg-derrota"></p>
    <button id="btn-reiniciar" onclick="reiniciarParaMenu()">🔄 Voltar ao Menu Inicial</button>
  </div>

  <!-- TELA 4: VITÓRIA -->
  <div id="painel-vitoria" class="oculto">
    <h2>🏆 VITÓRIA!</h2>
    <p id="msg-vitoria"></p>
    <p id="msg-pontuacao-final"></p>
    <button id="btn-vitoria" onclick="reiniciarParaMenu()">🔄 Jogar Novamente</button>
  </div>

  <!-- DEPENDÊNCIAS DE SCRIPTS -->
  <script src="entidades.js"></script>
  <script src="jogo.js"></script>
</body>
</html>
```

---

#### Passo 2: CSS Com Temas de Acessibilidade (`style.css`)

```css
* {
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
  transition: background-color 0.3s, color 0.3s;
}

/* ==========================================
   PALETAS DE TEMA E ACESSIBILIDADE (A11Y)
   ========================================== */
/* 1. Tema Padrão (Cyber Dark) */
body.tema-padrao {
  background-color: #121214;
  color: #ffffff;
}
body.tema-padrao #painel-menu,
body.tema-padrao #painel-game-over,
body.tema-padrao #painel-vitoria {
  background-color: #202024;
  border: 1px solid #41414d;
}
body.tema-padrao #heroi { background-color: #8257e5; }
body.tema-padrao .entidade.bloco { background-color: #7c7c8a; }
body.tema-padrao .entidade.espinho { border-bottom-color: #e83f5b; }
body.tema-padrao .entidade.bau { background-color: #fba94c; }

/* 2. Tema Alto Contraste (Acessibilidade Visual) */
body.tema-alto-contraste {
  background-color: #000000;
  color: #ffff00;
}
body.tema-alto-contraste #painel-menu,
body.tema-alto-contraste #painel-game-over,
body.tema-alto-contraste #painel-vitoria {
  background-color: #000000;
  border: 3px solid #ffff00;
}
body.tema-alto-contraste #heroi {
  background-color: #ffff00;
  border: 2px solid #ffffff;
}
body.tema-alto-contraste .entidade.bloco {
  background-color: #ffffff;
  border: 3px solid #ffff00;
}
body.tema-alto-contraste .entidade.espinho {
  border-bottom-color: #ff0000;
  filter: drop-shadow(0 0 6px #ff0000);
}
body.tema-alto-contraste .entidade.bau {
  background-color: #00ffff;
  border: 2px solid #ffffff;
}

/* 3. Tema Retrô Arcade */
body.tema-retro {
  background-color: #000033;
  color: #00ffcc;
}
body.tema-retro #painel-menu,
body.tema-retro #painel-game-over,
body.tema-retro #painel-vitoria {
  background-color: #000066;
  border: 2px solid #00ffcc;
}
body.tema-retro #heroi { background-color: #ff00ff; }
body.tema-retro .entidade.bloco { background-color: #00ccff; }
body.tema-retro .entidade.espinho { border-bottom-color: #ff3300; }
body.tema-retro .entidade.bau { background-color: #ffff00; }

/* UTILITÁRIOS E LAYOUT */
.oculto { display: none !important; }

#painel-menu, #painel-game-over, #painel-vitoria {
  padding: 20px 30px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  min-width: 340px;
}

.campo-config {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 0.9rem;
}

#input-nome, select {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #7c7c8a;
  background-color: #121214;
  color: #ffffff;
}

#btn-iniciar, #btn-reiniciar, #btn-vitoria {
  background-color: #8257e5;
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

#hud {
  margin-bottom: 15px;
  font-size: 1.1rem;
  display: flex;
  gap: 20px;
  align-items: center;
  font-weight: bold;
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
  transition: width 0.3s ease;
}

#arena {
  width: 600px;
  height: 300px;
  background-color: #18181b;
  border: 2px solid #41414d;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

#pista {
  width: 1800px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

#heroi {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  left: 50px;
  bottom: 20px;
  z-index: 2;
}

.entidade { position: absolute; bottom: 20px; }
.entidade.bloco { width: 40px; height: 60px; border-radius: 4px; }
.entidade.espinho {
  width: 0; height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 45px solid;
}
.entidade.bau { width: 35px; height: 35px; border-radius: 4px; }

/* ATAQUE NORMAL (HORIZONTAL) */
.faca {
  width: 30px;
  height: 15px;
  background-color: #fba94c;
  border: 2px solid #ffffff;
  border-radius: 2px;
  position: absolute;
  bottom: 30px;
  z-index: 3;
}

/* ATAQUE MERGULHADO (VERTICO-INFERIOR) */
.faca-down {
  width: 15px;
  height: 30px;
  background-color: #ff0055;
  border: 2px solid #ffffff;
  border-radius: 2px;
  position: absolute;
  z-index: 3;
  box-shadow: 0 0 12px #ff0055;
}
```

---

#### Passo 3: Gerenciamento do Mapa, Pontuação e Combate Aéreo (`entidades.js`)

```javascript
// ==========================================
// MÓDULO DE ENTIDADES, COMBATE E REJOGABILIDADE
// ==========================================
let entidades = [];
let pontuacao = 0;
let valorBaseEspinho = 200;

function gerarPosicaoAleatoria(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gerarMapaProcedural(qtdEspinhos) {
  limparEntidadesAnteriores();

  let containerPista = document.getElementById("pista");
  
  // Rateio de pontuação por espinho baseado no limite máximo de 1000 pontos
  valorBaseEspinho = Math.floor(1000 / qtdEspinhos);

  let espinhosCriados = 0;
  let totalEntidades = qtdEspinhos + 3; // Adiciona blocos e baús extras

  for (let i = 0; i < totalEntidades; i++) {
    let minX = 300 + (i * 180);
    let maxX = 420 + (i * 180);
    let posX = gerarPosicaoAleatoria(minX, maxX);

    let tipoSorteado = 'bloco';

    if (espinhosCriados < qtdEspinhos && (i % 2 === 1 || i === totalEntidades - 1)) {
      tipoSorteado = 'espinho';
      espinhosCriados++;
    } else if (i % 3 === 0) {
      tipoSorteado = 'bau';
    }

    let elEntidade = document.createElement("div");
    elEntidade.className = "entidade " + tipoSorteado;
    elEntidade.style.left = posX + "px";
    containerPista.appendChild(elEntidade);

    let largura = (tipoSorteado === 'espinho') ? 40 : ((tipoSorteado === 'bau') ? 35 : 40);
    let altura = (tipoSorteado === 'espinho') ? 45 : ((tipoSorteado === 'bau') ? 35 : 60);

    entidades.push({
      id: i,
      tipo: tipoSorteado,
      x: posX,
      largura: largura,
      altura: altura,
      elementoDOM: elEntidade,
      emColisao: false
    });
  }
}

function limparEntidadesAnteriores() {
  for (let ent of entidades) {
    if (ent.elementoDOM) {
      ent.elementoDOM.remove();
    }
  }
  entidades = [];
}

// ==========================================
// ATAQUE DE FACA E ATAQUE MERGULHADO (POUND DOWN)
// ==========================================
function atacarComFaca() {
  let containerPista = document.getElementById("pista");

  // LIMPEZA DE INSTÂNCIAS ANTERIORES (OPÇÃO B - EVITA ACÚMULO VISUAL)
  let facaAntiga = containerPista.querySelector(".faca, .faca-down");
  if (facaAntiga) {
    facaAntiga.remove();
  }

  // Verifica se o jogador acionou o Ataque Mergulhado para Baixo (Pound Down)
  let eAtaqueMergulhado = emPulo && (teclasPressionadas["KeyS"] || teclasPressionadas["ArrowDown"]);

  let elFaca = document.createElement("div");
  let facaX = 0;
  let facaY = 0;

  if (eAtaqueMergulhado) {
    // 1. Aplica aceleração vertical brusca para baixo
    velocidadeY = -16;

    elFaca.className = "faca-down";
    facaX = posX + 12; // Alinhado ao centro do círculo
    facaY = posY - 25; // Logo abaixo do Herói

    elFaca.style.left = facaX + "px";
    elFaca.style.bottom = facaY + "px";
    containerPista.appendChild(elFaca);
  } else {
    // 2. Ataque Horizontal Padrão
    elFaca.className = "faca";
    facaX = (direcaoOlhar === 1) ? (posX + 40) : (posX - 30);
    facaY = posY + 10;

    elFaca.style.left = facaX + "px";
    elFaca.style.bottom = facaY + "px";
    containerPista.appendChild(elFaca);
  }

  // Auto-remoção após 300ms
  setTimeout(function() {
    if (elFaca.parentNode) {
      elFaca.remove();
    }
  }, 300);

  // Checagem de Colisão do Golpe
  for (let i = entidades.length - 1; i >= 0; i--) {
    let ent = entidades[i];

    let acertouX = (facaX + 30 >= ent.x) && (facaX <= ent.x + ent.largura);
    let acertouY = (posY <= 20 + ent.altura + 15);

    if (acertouX && acertouY) {
      if (ent.tipo === 'bau') {
        curarHeroi(30);
        ent.elementoDOM.remove();
        entidades.splice(i, 1);
      } else if (ent.tipo === 'espinho') {
        // CÁLCULO DE PONTUAÇÃO COM BÔNUS OCULTO NO MERGULHO
        let pontosGanhos = eAtaqueMergulhado ? (valorBaseEspinho * 2) : valorBaseEspinho;
        pontuacao += pontosGanhos;
        atualizarPontuacao();

        if (eAtaqueMergulhado) {
          console.log("⚡ GOLPE MERGULHADO! Bônus de Pontos em Dobro: +" + pontosGanhos);
        }

        ent.elementoDOM.remove();
        entidades.splice(i, 1);
        verificarCondicaoVitoria();
      } else {
        // Blocos Neutros Destruídos
        ent.elementoDOM.remove();
        entidades.splice(i, 1);
      }
    }
  }
}
```

---

#### Passo 4: Motor do Jogo, Dificuldades e UI (`jogo.js`)

```javascript
// ==========================================
// MOTOR PRINCIPAL DO JOGO E EVENTOS DE UI
// ==========================================
let estadoJogo = 'MENU';
let nomeHeroi = "Valente";
let vida = 100;
let maxVida = 100;

let posX = 50;
let posY = 20;
let velocidadeX = 5;
let velocidadeY = 0;
let gravidade = 0.6;
let emPulo = false;
let direcaoOlhar = 1;

let teclasPressionadas = {};

// CONFIGURAÇÃO DE TEMAS E ACESSIBILIDADE
let selectTema = document.getElementById("select-tema");
selectTema.addEventListener("change", function() {
  document.body.className = selectTema.value;
});

// ISOLAMENTO DE TECLADO
let inputNome = document.getElementById("input-nome");
inputNome.addEventListener("keydown", function(e) {
  e.stopPropagation();
});

// CAPTURA DE TECLAS
window.addEventListener("keydown", function(e) {
  teclasPressionadas[e.code] = true;

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

function iniciarJogo() {
  if (inputNome.value.trim() !== "") {
    nomeHeroi = inputNome.value.trim();
  }
  document.getElementById("label-heroi").innerText = "Herói: " + nomeHeroi;

  estadoJogo = 'JOGANDO';
  document.getElementById("painel-menu").classList.add("oculto");
  document.getElementById("painel-game-over").classList.add("oculto");
  document.getElementById("painel-vitoria").classList.add("oculto");
  document.getElementById("hud").classList.remove("oculto");
  document.getElementById("arena").classList.remove("oculto");

  // Reset de estado e pontuação
  vida = maxVida;
  pontuacao = 0;
  posX = 50;
  posY = 20;
  velocidadeY = 0;
  emPulo = false;
  direcaoOlhar = 1;
  atualizarBarraVida();
  atualizarPontuacao();

  // Leitura da Dificuldade Escolhida
  let dificuldade = document.getElementById("select-dificuldade").value;
  let qtdEspinhos = 5; // Normal padrão

  if (dificuldade === 'facil') qtdEspinhos = 3;
  if (dificuldade === 'dificil') qtdEspinhos = 7;

  // Geração Procedural do Mapa com a Dificuldade Selecionada
  gerarMapaProcedural(qtdEspinhos);

  requestAnimationFrame(atualizarLoopFisica);
}

function atualizarLoopFisica() {
  if (estadoJogo !== 'JOGANDO') return;

  let elementoHeroi = document.getElementById("heroi");
  let elementoArena = document.getElementById("arena");

  // Movimentação Horizontal
  if (teclasPressionadas["KeyD"] || teclasPressionadas["ArrowRight"]) {
    posX += velocidadeX;
    direcaoOlhar = 1;
  }
  if (teclasPressionadas["KeyA"] || teclasPressionadas["ArrowLeft"]) {
    posX -= velocidadeX;
    direcaoOlhar = -1;
  }

  if (posX < 0) posX = 0;
  if (posX > 1755) posX = 1755;

  // Pulo
  if ((teclasPressionadas["Space"] || teclasPressionadas["KeyW"]) && !emPulo) {
    velocidadeY = 12;
    emPulo = true;
  }

  // Aplicação da Gravidade
  posY += velocidadeY;
  if (emPulo) velocidadeY -= gravidade;

  if (posY <= 20) {
    posY = 20;
    velocidadeY = 0;
    emPulo = false;
  }

  // Atualização Visual
  elementoHeroi.style.left = posX + "px";
  elementoHeroi.style.bottom = posY + "px";
  elementoArena.scrollLeft = posX - 200;

  verificarColisoesEntidades();

  requestAnimationFrame(atualizarLoopFisica);
}

function verificarColisoesEntidades() {
  let heroiLargura = 40;

  for (let i = entidades.length - 1; i >= 0; i--) {
    let ent = entidades[i];

    let colidiuX = (posX + heroiLargura > ent.x) && (posX < ent.x + ent.largura);
    let colidiuY = (posY < 20 + ent.altura);

    if (colidiuX && colidiuY) {
      if (ent.tipo === 'espinho') {
        if (!ent.emColisao) {
          ent.emColisao = true;
          vida -= 20;
          atualizarBarraVida();

          if (vida <= 0) {
            vida = 0;
            encerrarJogo(false);
          }
        }
      } else if (ent.tipo === 'bau') {
        curarHeroi(30);
        ent.elementoDOM.remove();
        entidades.splice(i, 1);
      }
    } else {
      ent.emColisao = false;
    }
  }
}

function verificarCondicaoVitoria() {
  let espinhosRestantes = entidades.filter(e => e.tipo === 'espinho');
  if (espinhosRestantes.length === 0) {
    encerrarJogo(true);
  }
}

function encerrarJogo(vitoria) {
  if (vitoria) {
    estadoJogo = 'VITORIA';
    document.getElementById("painel-vitoria").classList.remove("oculto");
    document.getElementById("msg-vitoria").innerText = "🏆 Parabéns " + nomeHeroi + "! Pista limpa!";
    document.getElementById("msg-pontuacao-final").innerText = "Pontuação Total: " + pontuacao + " Pts";
  } else {
    estadoJogo = 'GAME_OVER';
    document.getElementById("painel-game-over").classList.remove("oculto");
    document.getElementById("msg-derrota").innerText = "☠️ " + nomeHeroi + " foi derrotado pelos espinhos!";
  }
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

function curarHeroi(quantidade) {
  if (vida > 0 && vida < maxVida) {
    vida += quantidade;
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

function atualizarPontuacao() {
  document.getElementById("label-pontos").innerText = "Pontos: " + pontuacao;
}
```

---

### 6. 🔥 Aprofundamento Hardcore (Bastidores da Engenharia)

#### A - Otimização do DOM via Limpeza de Nós Existentes
Ao efetuar múltiplos cliques rápidos em um jogo de ação, instanciar nós com `document.createElement()` sem destruir a faca ativa anterior gera dois sérios problemas:
1. **Garbage Collection Pressure:** O motor V8 do JS é obrigado a alocar e descontaminar dezenas de instâncias por segundo.
2. **Desincronização Visual:** Nós antigos continuam na tela em posições onde o personagem não está mais.

Utilizando a busca por classe no container (`containerPista.querySelector(".faca, .faca-down")`) e invocando `.remove()` antes de gerar o novo nó, mantemos a contagem de facas ativas no DOM cravada em **no máximo 1 nó por vez**, sem introduzir *delays* que travem o ritmado de ataque do jogador.

#### B - Manipulação de CSS Classes via `document.body.className`
Para alternar os temas de acessibilidade sem reescrever linhas e linhas de código via JS, mudamos a classe global da tag `<body>`. Com isso, o motor do navegador recompila o CSS de uma só vez utilizando as seleções dependentes (`body.tema-alto-contraste .entidade`), alterando toda a paleta da página em um único ciclo de renderização (*Reflow/Repaint Optimization*).
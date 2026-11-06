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
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

// MAPA DE TECLAS PRESSIONADAS (Combinação simultânea de eixos)
let teclasPressionadas = {};

// DADOS DO OBSTÁCULO FIXO
let obstaculoX = 800;
let obstaculoLargura = 35;
let obstaculoAltura = 50;
let emColisao = false;

// CORREÇÃO DO BUG DO DIGITO (stopPropagation)
let inputNome = document.getElementById("input-nome");
inputNome.addEventListener("keydown", function(e) {
  e.stopPropagation(); // Impede que digitar no input mova o herói na arena!
});

// ESCUTA CONTINUA DE TECLAS PRESSIONADAS E SOLTAS
window.addEventListener("keydown", function(e) {
  teclasPressionadas[e.code] = true;
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

  // Inicia o Loop Contínuo de Física a 60 FPS
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

  // Aplica gravidade no pulo
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
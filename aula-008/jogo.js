// ==========================================
// MOTOR PRINCIPAL DO JOGO (LOOP E FÍSICA)
// ==========================================
let estadoJogo = 'MENU'; // 'MENU' | 'JOGANDO' | 'GAME_OVER' | 'VITORIA'
let nomeHeroi = "Valente";
let vida = 100;
let maxVida = 100;

// FÍSICA E ORIENTAÇÃO DO HERÓI
let posX = 50;
let posY = 20;
let velocidadeX = 5;
let velocidadeY = 0;
let gravidade = 0.6;
let emPulo = false;
let direcaoOlhar = 1; // 1 = Direita, -1 = Esquerda

// MAPA DE TECLAS
let teclasPressionadas = {};

// ISOLAMENTO DE TECLADO NO INPUT DE NOME
let inputNome = document.getElementById("input-nome");
inputNome.addEventListener("keydown", function(e) {
  e.stopPropagation();
});

// ESCUTA DE TECLAS
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

// ==========================================
// TRANSIÇÃO DE TELAS E INICIALIZAÇÃO
// ==========================================
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

  // Reset de estado
  vida = maxVida;
  posX = 50;
  posY = 20;
  velocidadeY = 0;
  emPulo = false;
  direcaoOlhar = 1;
  atualizarBarraVida();

  // Gera o mapa com 3 tipos de entidades
  gerarMapaProcedural();

  requestAnimationFrame(atualizarLoopFisica);
}

// ==========================================
// LOOP DE FÍSICA A 60 FPS
// ==========================================
function atualizarLoopFisica() {
  if (estadoJogo !== 'JOGANDO') return;

  let elementoHeroi = document.getElementById("heroi");
  let elementoArena = document.getElementById("arena");

  // Movimentação Horizontal e Atualização de Direção de Olhar
  if (teclasPressionadas["KeyD"] || teclasPressionadas["ArrowRight"]) {
    posX += velocidadeX;
    direcaoOlhar = 1;
  }
  if (teclasPressionadas["KeyA"] || teclasPressionadas["ArrowLeft"]) {
    posX -= velocidadeX;
    direcaoOlhar = -1;
  }

  // Trava das Bordas (1755px previne o canto quadrado no limite da arena)
  if (posX < 0) posX = 0;
  if (posX > 1755) posX = 1755;

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

  // Atualização Visual no DOM
  elementoHeroi.style.left = posX + "px";
  elementoHeroi.style.bottom = posY + "px";

  // Câmera de Scroll
  elementoArena.scrollLeft = posX - 200;

  // Verifica Colisões do Herói com as Entidades
  verificarColisoesEntidades();

  requestAnimationFrame(atualizarLoopFisica);
}

// ==========================================
// COLISÕES E CONDIÇÕES DE VITÓRIA / DERROTA
// ==========================================
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
          console.log("💥 " + nomeHeroi + " pisou em espinhos! HP: " + vida);

          if (vida <= 0) {
            vida = 0;
            encerrarJogo(false);
          }
        }
      } else if (ent.tipo === 'bau') {
        // Tocar no baú restaura vida e o consome
        curarHeroi(30);
        console.log("📦 Baú coletado ao tocar! +30 HP restaurados.");
        ent.elementoDOM.remove();
        entidades.splice(i, 1);
      } else if (ent.tipo === 'bloco') {
        // Blocos funcionam apenas como obstáculos neutros
      }
    } else {
      ent.emColisao = false;
    }
  }
}

function verificarCondicaoVitoria() {
  // Filtra quantos espinhos ainda restam no mapa
  let espinhosRestantes = entidades.filter(e => e.tipo === 'espinho');

  if (espinhosRestantes.length === 0) {
    console.log("🏆 Todos os espinhos foram removidos! Vitória alcançada.");
    encerrarJogo(true);
  }
}

function encerrarJogo(vitoria) {
  if (vitoria) {
    estadoJogo = 'VITORIA';
    document.getElementById("painel-vitoria").classList.remove("oculto");
  } else {
    estadoJogo = 'GAME_OVER';
    document.getElementById("painel-game-over").classList.remove("oculto");
    document.getElementById("msg-derrota").innerText = "☠️ " + nomeHeroi + " sucumbiu aos espinhos da arena!";
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
// ==========================================
// MOTOR PRINCIPAL DO JOGO (LOOP E FÍSICA)
// ==========================================
let estadoJogo = 'MENU'; // 'MENU' | 'JOGANDO' | 'GAME_OVER' | 'VITORIA'
let nomeHeroi = "Valente";
let vida = 100;
let maxVida = 100;
let pontuacao = 0;
let qtdEspinhosAtual = 5;

// FÍSICA E ORIENTAÇÃO DO HERÓI
let posX = 50;
let posY = 20;
let velocidadeX = 5;
let velocidadeY = 0;
let gravidade = 0.6;
let emPulo = false;
let emMergulho = false;
let direcaoOlhar = 1;

let teclasPressionadas = {};

let inputNome = document.getElementById("input-nome");
inputNome.addEventListener("keydown", function(e) {
  e.stopPropagation();
});

window.addEventListener("keydown", function(e) {
  teclasPressionadas[e.code] = true;

  if ((e.code === "KeyJ" || e.code === "KeyF") && estadoJogo === 'JOGANDO') {
    if (emPulo && (teclasPressionadas["KeyS"] || teclasPressionadas["ArrowDown"])) {
      emMergulho = true;
      velocidadeY = -16;
      atacarComFaca(true);
    } else {
      atacarComFaca(false);
    }
  }
});

window.addEventListener("keyup", function(e) {
  teclasPressionadas[e.code] = false;
});

let selectTema = document.getElementById("select-tema");
selectTema.addEventListener("change", function() {
  document.body.className = selectTema.value;
});

let sliderBrilho = document.getElementById("slider-brilho");
sliderBrilho.addEventListener("input", function() {
  document.getElementById("arena").style.opacity = sliderBrilho.value;
});

function iniciarJogo() {
  if (inputNome.value.trim() !== "") {
    nomeHeroi = inputNome.value.trim();
  }
  document.getElementById("label-heroi").innerText = "Herói: " + nomeHeroi;

  qtdEspinhosAtual = parseInt(document.getElementById("select-dificuldade").value);

  estadoJogo = 'JOGANDO';
  document.getElementById("painel-menu").classList.add("oculto");
  document.getElementById("painel-game-over").classList.add("oculto");
  document.getElementById("painel-vitoria").classList.add("oculto");
  document.getElementById("hud").classList.remove("oculto");
  document.getElementById("arena").classList.remove("oculto");

  vida = maxVida;
  pontuacao = 0;
  posX = 50;
  posY = 20;
  velocidadeY = 0;
  emPulo = false;
  emMergulho = false;
  direcaoOlhar = 1;
  atualizarBarraVida();
  atualizarPontuacaoHUD();

  gerarMapaProcedural(qtdEspinhosAtual);

  requestAnimationFrame(atualizarLoopFisica);
}

function atualizarLoopFisica() {
  if (estadoJogo !== 'JOGANDO') return;

  let elementoHeroi = document.getElementById("heroi");
  let elementoArena = document.getElementById("arena");

  if (!emMergulho) {
    if (teclasPressionadas["KeyD"] || teclasPressionadas["ArrowRight"]) {
      posX += velocidadeX;
      direcaoOlhar = 1;
    }
    if (teclasPressionadas["KeyA"] || teclasPressionadas["ArrowLeft"]) {
      posX -= velocidadeX;
      direcaoOlhar = -1;
    }
  }

  if (posX < 0) posX = 0;
  if (posX > 1755) posX = 1755;

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
    emMergulho = false;
  }

  // Debugger de colisão sólida em blocos
  resolverColisaoFisicaBlocos();

  elementoHeroi.style.left = posX + "px";
  elementoHeroi.style.bottom = posY + "px";

  elementoArena.scrollLeft = posX - 200;

  verificarColisoesEntidades();

  requestAnimationFrame(atualizarLoopFisica);
}

function resolverColisaoFisicaBlocos() {
  let heroiLargura = 40;
  let heroiAltura = 40;

  for (let ent of entidades) {
    if (ent.tipo === 'bloco') {
      let colidiuX = (posX + heroiLargura > ent.x) && (posX < ent.x + ent.largura);
      let colidiuY = (posY < 20 + ent.altura) && (posY + heroiAltura > 20);

      if (colidiuX && colidiuY) {
        if (direcaoOlhar === 1 && (posX + heroiLargura - velocidadeX <= ent.x)) {
          posX = ent.x - heroiLargura;
        } 
        else if (direcaoOlhar === -1 && (posX + velocidadeX >= ent.x + ent.largura)) {
          posX = ent.x + ent.largura;
        }
      }
    }
  }
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
        adicionarPontos(15);
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
    document.getElementById("msg-vitoria").innerText = "🏆 Parabéns " + nomeHeroi + "! Você limpou a pista e fez " + pontuacao + " pontos!";
  } else {
    estadoJogo = 'GAME_OVER';
    document.getElementById("painel-game-over").classList.remove("oculto");
    document.getElementById("msg-derrota").innerText = "☠️ " + nomeHeroi + " sucumbiu aos espinhos! Pontuação Final: " + pontuacao;
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

function adicionarPontos(qtd) {
  pontuacao += qtd;
  atualizarPontuacaoHUD();
}

function atualizarPontuacaoHUD() {
  document.getElementById("label-pontos").innerText = "Pontos: " + pontuacao;
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

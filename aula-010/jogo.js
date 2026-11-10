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

// SISTEMA DE ARCO E TENSÃO
let tempoInicioArco = 0;
let carregandoArco = false;
let elFacaMergulho = null; // Ref visual da faca acoplada (Debugger 2)

let teclasPressionadas = {};

let inputNome = document.getElementById("input-nome");
inputNome.addEventListener("keydown", function(e) {
  e.stopPropagation();
});

// CAPTURA DE INPUTS - TECLADO DOWN
window.addEventListener("keydown", function(e) {
  teclasPressionadas[e.code] = true;

  if (estadoJogo !== 'JOGANDO') return;

  // MECÂNICA DE FACA CORPO A CORPO E MERGULHO
  if (e.code === "KeyJ" || e.code === "KeyF") {
    if (emPulo && (teclasPressionadas["KeyS"] || teclasPressionadas["ArrowDown"])) {
      // INÍCIO DO MERGULHO
      emMergulho = true;
      velocidadeY = -18;
      
      // DEBUGGER 2: Criamos e fixamos a faca apenas 1 vez (não remove após 300ms)
      if (!elFacaMergulho) {
         let containerPista = document.getElementById("pista");
         let facasAntigas = containerPista.querySelectorAll(".faca");
         facasAntigas.forEach(f => f.remove());
         
         elFacaMergulho = document.createElement("div");
         elFacaMergulho.className = "faca faca-baixo";
         containerPista.appendChild(elFacaMergulho);
      }
    } else if (!emMergulho) {
      // ATAQUE HORIZONTAL
      atacarComFacaHorizontal();
    }
  }

  // MECÂNICA DE ARCO (TENSÃO INICIAL)
  if (e.code === "KeyQ" && !carregandoArco) {
    carregandoArco = true;
    tempoInicioArco = performance.now();
  }
});

// CAPTURA DE INPUTS - TECLADO UP
window.addEventListener("keyup", function(e) {
  teclasPressionadas[e.code] = false;

  // DISPARO DO ARCO (FIM DA TENSÃO)
  if (e.code === "KeyQ" && carregandoArco) {
    carregandoArco = false;
    let tempoPressionado = performance.now() - tempoInicioArco;
    dispararArco(tempoPressionado);
  }
});

// UI EVENT LISTENERS
let selectTema = document.getElementById("select-tema");
selectTema.addEventListener("change", function() {
  document.body.className = selectTema.value;
});

let sliderBrilho = document.getElementById("slider-brilho");
sliderBrilho.addEventListener("input", function() {
  document.getElementById("arena").style.opacity = sliderBrilho.value;
});

// INICIALIZAÇÃO
function iniciarJogo() {
  if (inputNome.value.trim() !== "") nomeHeroi = inputNome.value.trim();
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
  elFacaMergulho = null;
  carregandoArco = false;
  atualizarBarraVida();
  atualizarPontuacaoHUD();

  gerarMapaProcedural(qtdEspinhosAtual);
  requestAnimationFrame(atualizarLoopFisica);
}

// ==========================================
// LOOP DE FÍSICA E ANIMAÇÃO A 60 FPS
// ==========================================
function atualizarLoopFisica() {
  if (estadoJogo !== 'JOGANDO') return;

  let elementoHeroi = document.getElementById("heroi");
  let elementoArena = document.getElementById("arena");

  // 1. MOVIMENTAÇÃO HORIZONTAL (Travada durante o mergulho contínuo)
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

  // 2. LIMITES DA PISTA (X)
  if (posX < 0) posX = 0;
  if (posX > 1755) posX = 1755;

  // 3. GRAVIDADE E PULO (Eixo Y)
  // Permitimos pular APENAS se estivermos no chão E não estivermos caindo de cima de um bloco
  if ((teclasPressionadas["Space"] || teclasPressionadas["KeyW"]) && !emPulo) {
    velocidadeY = 12;
    emPulo = true;
  }

  // 4. ATUALIZAÇÃO DO Y PREDITIVO
  let oldPosY = posY;
  posY += velocidadeY;
  
  if (emPulo) {
    velocidadeY -= gravidade; // Cai
  }

  // 5. DEBUGGER 1: RESOLUÇÃO FÍSICA NOS BLOCOS (Laterais e POUSO SUPERIOR)
  let tocandoTopoBloco = resolverColisaoFisicaBlocos(oldPosY);

  // 6. LIMITE INFERIOR DA PISTA (CHÃO DA ARENA)
  if (!tocandoTopoBloco && posY <= 20) {
    posY = 20;
    velocidadeY = 0;
    emPulo = false;
    finalizarMergulhoPoundDown(); // Ao tocar o chão, o mergulho se encerra.
  }

  // 7. RASTREIO DINÂMICO DA FACA DE MERGULHO (DEBUGGER 2)
  if (emMergulho && elFacaMergulho) {
     elFacaMergulho.style.left = (posX + 5) + "px";
     elFacaMergulho.style.bottom = (posY - 25) + "px";
     // Avalia colisão letal durante a descida continuamente
     avaliarColisaoFacaMergulhoDinamica(posX + 5, posY - 25, 30, 25);
  }

  // 8. ATUALIZAÇÕES VISUAIS DO HERÓI E CÂMERA
  elementoHeroi.style.left = posX + "px";
  elementoHeroi.style.bottom = posY + "px";
  elementoArena.scrollLeft = posX - 200;

  // 9. ATUALIZAR ENTIDADES INDEPENDENTES (FLECHAS E DANOS DE CONTATO)
  atualizarFisicaFlechas();
  verificarDanoEspinhosHeroi();

  requestAnimationFrame(atualizarLoopFisica);
}

// ==========================================
// FUNÇÕES DE FÍSICA, RASTREIO E RESOLUÇÃO (DEBUGGERS)
// ==========================================

function resolverColisaoFisicaBlocos(oldPosY) {
  let heroiLargura = 40;
  let heroiAltura = 40;
  let apoiadoEmAlgumBloco = false;

  for (let ent of entidades) {
    if (ent.tipo === 'bloco') {
      let entTopo = 20 + ent.altura;
      
      // Checagem de intersecção 2D total
      let intersecX = (posX + heroiLargura > ent.x) && (posX < ent.x + ent.largura);
      let intersecY = (posY < entTopo) && (posY + heroiAltura > 20);

      if (intersecX && intersecY) {
        // DEBUGGER 1.A: ATERRISSAGEM / POUSO NO TOPO (Y COLLISION)
        // Se a base do herói estava ACIMA ou IGUAL ao topo antes da atualização, 
        // e ele está caindo (vy < 0)
        if (oldPosY >= entTopo && velocidadeY < 0) {
            posY = entTopo; // Trava a altura perfeitamente no topo
            velocidadeY = 0;
            emPulo = false; // Permite pular de cima do bloco
            apoiadoEmAlgumBloco = true;
            finalizarMergulhoPoundDown(); // Aterrissar em cima quebra o mergulho
        } 
        // DEBUGGER 1.B: COLISÃO LATERAL (X COLLISION)
        else {
            if (direcaoOlhar === 1 && (posX + heroiLargura - velocidadeX <= ent.x)) {
              posX = ent.x - heroiLargura;
            } 
            else if (direcaoOlhar === -1 && (posX + velocidadeX >= ent.x + ent.largura)) {
              posX = ent.x + ent.largura;
            }
        }
      }
      
      // CHECAGEM DE QUEDA (Se andou pra fora do topo do bloco sem pular)
      // Se não estou no chão puro, não bati o teto, mas estou caindo da borda
      if (!intersecX && posY === entTopo && !emPulo) {
         emPulo = true; // Inicia a queda livre
      }
    }
  }
  
  return apoiadoEmAlgumBloco;
}

function avaliarColisaoFacaMergulhoDinamica(facaX, facaY, fLargura, fAltura) {
   for (let i = entidades.length - 1; i >= 0; i--) {
    let ent = entidades[i];

    let acertouX = (facaX + fLargura >= ent.x) && (facaX <= ent.x + ent.largura);
    let acertouY = (facaY <= 20 + ent.altura) && (facaY + fAltura >= 20);

    if (acertouX && acertouY) {
      let pts = Math.floor(100 / qtdEspinhosAtual) * 2; // Dobro no Pound Down
      adicionarPontos(pts);
      if (ent.tipo === 'bau') curarHeroi(30);
      
      ent.elementoDOM.remove();
      entidades.splice(i, 1);
      verificarCondicaoVitoria();
    }
  }
}

function atacarComFacaHorizontal() {
  let containerPista = document.getElementById("pista");
  let facaAntiga = containerPista.querySelector(".faca");
  if (facaAntiga) facaAntiga.remove();

  let elFaca = document.createElement("div");
  elFaca.className = "faca";
  
  let facaX = (direcaoOlhar === 1) ? (posX + 40) : (posX - 30);
  let facaY = posY + 10;
  
  elFaca.style.left = facaX + "px";
  elFaca.style.bottom = facaY + "px";
  containerPista.appendChild(elFaca);

  setTimeout(function() {
    if (elFaca.parentNode) elFaca.remove();
  }, 300);

  // Dano instantâneo lateral
  avaliarColisaoFacaMergulhoDinamica(facaX, facaY, 30, 15); 
}

function finalizarMergulhoPoundDown() {
    if (emMergulho) {
        emMergulho = false;
        if (elFacaMergulho && elFacaMergulho.parentNode) {
            elFacaMergulho.remove();
            elFacaMergulho = null;
        }
    }
}

// ==========================================
// STATUS, DANOS VIVOS E UI
// ==========================================

function verificarDanoEspinhosHeroi() {
  let heroiLargura = 40;

  for (let i = entidades.length - 1; i >= 0; i--) {
    let ent = entidades[i];
    let colidiuX = (posX + heroiLargura > ent.x) && (posX < ent.x + ent.largura);
    let colidiuY = (posY < 20 + ent.altura); // Bate nas pernas/corpo

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
      } 
      // Coleta por toque direto no baú (se não cortou antes)
      else if (ent.tipo === 'bau') {
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
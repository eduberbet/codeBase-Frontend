// ==========================================
// ESTADO DO JOGO EM VARIÁVEIS NA MEMÓRIA
// ==========================================
let nomeHeroi = "Valente";
let vida = 100;
let maxVida = 100;

// NOVO (Aula 005): POSICIONAMENTO 2D NA ARENA
let posX = 50;        // Posição horizontal (Eixo X - Left)
let posY = 20;        // Posição vertical (Eixo Y - Bottom)
let velocidadeX = 15; // Passos em pixels por movimento

/**
 * Captura o valor do <input> e atualiza o estado
 */
function confirmarNome() {
  let inputElemento = document.getElementById("input-nome");

  if (inputElemento.value.trim() !== "") {
    nomeHeroi = inputElemento.value.trim();
    document.getElementById("label-heroi").innerText = "Herói: " + nomeHeroi;
    console.log("👤 Nome do Herói alterado para: " + nomeHeroi);
  }
}

/**
 * Ação do pulo com trava de segurança contra o "Bug do Defunto"
 */
function executarPuloSuicida() {
  if (vida > 0) {
    let elementoHeroi = document.getElementById("heroi");

    // 1. Pulo no eixo Y
    posY = 100;
    elementoHeroi.style.bottom = posY + "px";

    // 2. Aplica o dano (-25 HP)
    vida -= 25;

    // 3. Checa condição de morte
    if (vida <= 0) {
      vida = 0;
      elementoHeroi.style.backgroundColor = "#e83f5b";
      document.getElementById("btn-curar").disabled = true;
      alert("☠️ Game Over! " + nomeHeroi + " morreu e não pode mais pular nem se curar.");
    }

    // 4. Atualiza a barra gráfica
    atualizarBarraVida();

    // 5. Retorna ao chão após 200ms
    setTimeout(function() {
      if (vida > 0) {
        posY = 20;
        elementoHeroi.style.bottom = posY + "px";
      }
    }, 200);

  } else {
    console.log("🚫 Ação ignorada: O Herói está morto.");
  }
}

/**
 * Função de cura do Herói
 */
function curarHeroi() {
  if (vida > 0 && vida < maxVida) {
    vida += 25;

    if (vida > maxVida) {
      vida = maxVida;
    }

    atualizarBarraVida();
    console.log("💚 " + nomeHeroi + " foi curado! HP atual: " + vida);
  }
}

/**
 * Atualiza a largura e cor da Barra de Vida CSS
 */
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

// ==========================================
// NOVO (Aula 005): CONTROLES DE TECLADO GLOBAL
// ==========================================
window.addEventListener("keydown", function(event) {
  let elementoHeroi = document.getElementById("heroi");

  // Trava de segurança: morto não anda nem pula
  if (vida <= 0) return;

  switch (event.code) {
    // ⬅️ MOVER PARA A ESQUERDA (Seta Esquerda ou Tecla A)
    case "ArrowLeft":
    case "KeyA":
      event.preventDefault();
      posX -= velocidadeX;
      
      // Limite da parede esquerda (0px)
      if (posX < 0) posX = 0;
      
      elementoHeroi.style.left = posX + "px";
      narrarAcao(nomeHeroi + " moveu para a esquerda.");
      break;

    // ➡️ MOVER PARA A DIREITA (Seta Direita ou Tecla D)
    case "ArrowRight":
    case "KeyD":
      event.preventDefault();
      posX += velocidadeX;

      // Limite da parede direita (600px - 40px herói = 560px)
      if (posX > 560) posX = 560;

      elementoHeroi.style.left = posX + "px";
      narrarAcao(nomeHeroi + " moveu para a direita.");
      break;

    // ⬆️ PULAR (Espaço, Seta Cima ou Tecla W)
    case "Space":
    case "ArrowUp":
    case "KeyW":
      event.preventDefault(); // Impede rolagem de página
      executarPuloSuicida();
      break;

    // 💚 CURAR (Tecla C)
    case "KeyC":
      curarHeroi();
      break;
  }
});

// ==========================================
// NOVO (Aula 005): PAINEL DE CONFIGURAÇÕES
// ==========================================
let sliderBrilho = document.getElementById("slider-brilho");
sliderBrilho.addEventListener("input", function() {
  let arena = document.getElementById("arena");
  arena.style.opacity = sliderBrilho.value;
  narrarAcao("Brilho ajustado para " + Math.round(sliderBrilho.value * 100) + "%");
});

function narrarAcao(texto) {
  let checkNarrador = document.getElementById("check-narrador");
  if (checkNarrador && checkNarrador.checked) {
    console.log("📢 [NARRADOR]: " + texto);
  }
}
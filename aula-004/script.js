// ==========================================
// ESTADO DO JOGO EM VARIÁVEIS NA MEMÓRIA
// ==========================================
let nomeHeroi = "Valente"; // NOVO (Aula 004): Nome retido do Herói
let vida = 100;
let maxVida = 100;
let posicaoY = 20;

/**
 * NOVO (Aula 004): Captura o valor do <input> e atualiza o estado
 */
function confirmarNome() {
  let inputElemento = document.getElementById("input-nome");

  // O .trim() remove espaços em branco acidentais no início e no fim
  if (inputElemento.value.trim() !== "") {
    nomeHeroi = inputElemento.value.trim();
    
    // Atualiza a interface com o novo nome capturado
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

    // 1. Faz o herói subir (Pulo)
    posicaoY = 100;
    elementoHeroi.style.bottom = posicaoY + "px";

    // 2. Aplica o dano (-25 HP)
    vida -= 25;

    // 3. Checa condição de morte
    if (vida <= 0) {
      vida = 0;
      elementoHeroi.style.backgroundColor = "#e83f5b"; // Cor de derrota
      document.getElementById("btn-curar").disabled = true;
      
      // NOVO (Aula 004): Alerta usando a variável nomeHeroi
      alert("☠️ Game Over! " + nomeHeroi + " morreu e não pode mais pular nem se curar.");
    }

    // 4. Atualiza o indicador gráfico de HP
    atualizarBarraVida();

    // 5. Retorna ao chão após 200ms
    setTimeout(function() {
      if (vida > 0) {
        posicaoY = 20;
        elementoHeroi.style.bottom = posicaoY + "px";
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
    // NOVO (Aula 004): Log personalizado com o nome do Herói
    console.log("💚 " + nomeHeroi + " foi curado! HP atual: " + vida);
  }
}

/**
 * Calcula a porcentagem e atualiza a largura e cor da Barra de Vida CSS
 */
function atualizarBarraVida() {
  let elementoBarra = document.getElementById("barra-vida");
  let porcentagem = (vida / maxVida) * 100;

  elementoBarra.style.width = porcentagem + "%";

  if (porcentagem > 60) {
    elementoBarra.style.backgroundColor = "#04d361"; // Verde (Saudável)
  } else if (porcentagem > 25) {
    elementoBarra.style.backgroundColor = "#fba94c"; // Amarelo (Atenção)
  } else {
    elementoBarra.style.backgroundColor = "#e83f5b"; // Vermelho (Perigo)
  }
}
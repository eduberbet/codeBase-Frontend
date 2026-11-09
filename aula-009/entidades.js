// ==========================================
// MÓDULO DE ENTIDADES E GERENCIAMENTO DO MAPA
// ==========================================
let entidades = [];

function gerarPosicaoAleatoria(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gerarMapaProcedural(qtdEspinhos) {
  limparEntidadesAnteriores();

  let containerPista = document.getElementById("pista");
  let tiposBase = ['bloco', 'bau'];

  // 1. Gera os Espinhos estipulados pela dificuldade
  for (let i = 0; i < qtdEspinhos; i++) {
    let minX = 300 + (i * 200);
    let maxX = 450 + (i * 200);
    let posX = gerarPosicaoAleatoria(minX, maxX);

    criarEntidadeNoDOM(containerPista, 'espinho', posX);
  }

  // 2. Preenche com Blocos e Baús nos espaços restantes
  for (let i = 0; i < 4; i++) {
    let posX = gerarPosicaoAleatoria(400 + (i * 300), 600 + (i * 300));
    let tipoSorteado = tiposBase[i % tiposBase.length];

    criarEntidadeNoDOM(containerPista, tipoSorteado, posX);
  }
}

function criarEntidadeNoDOM(container, tipo, posX) {
  let elEntidade = document.createElement("div");
  elEntidade.className = "entidade " + tipo;
  elEntidade.style.left = posX + "px";
  container.appendChild(elEntidade);

  let largura = (tipo === 'espinho') ? 40 : ((tipo === 'bau') ? 35 : 40);
  let altura = (tipo === 'espinho') ? 45 : ((tipo === 'bau') ? 35 : 60);

  entidades.push({
    id: entidades.length,
    tipo: tipo,
    x: posX,
    largura: largura,
    altura: altura,
    elementoDOM: elEntidade,
    emColisao: false
  });
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
// SISTEMA DE ATAQUE CORPO A CORPO (FACA)
// ==========================================
function atacarComFaca(paraBaixo = false) {
  let containerPista = document.getElementById("pista");

  // Limpeza de instâncias anteriores (Opção B)
  let facaAntiga = containerPista.querySelector(".faca");
  if (facaAntiga) {
    facaAntiga.remove();
  }

  let facaX = posX;
  let facaY = posY;
  let facaLargura = 30;
  let facaAltura = 15;

  let elFaca = document.createElement("div");
  elFaca.className = "faca";

  if (paraBaixo) {
    facaX = posX + 5;
    facaY = posY - 25;
    facaLargura = 30;
    facaAltura = 25;
    elFaca.classList.add("faca-baixo");
    elFaca.style.left = facaX + "px";
    elFaca.style.bottom = facaY + "px";
  } else {
    facaX = (direcaoOlhar === 1) ? (posX + 40) : (posX - 30);
    facaY = posY + 10;
    elFaca.style.left = facaX + "px";
    elFaca.style.bottom = facaY + "px";
  }

  containerPista.appendChild(elFaca);

  setTimeout(function() {
    if (elFaca.parentNode) {
      elFaca.remove();
    }
  }, 300);

  // Colisão da faca contra entidades
  for (let i = entidades.length - 1; i >= 0; i--) {
    let ent = entidades[i];

    let acertouX = (facaX + facaLargura >= ent.x) && (facaX <= ent.x + ent.largura);
    let acertouY = (facaY <= 20 + ent.altura) && (facaY + facaAltura >= 20);

    if (acertouX && acertouY) {
      let pontosGanhos = Math.floor(100 / qtdEspinhosAtual);
      if (paraBaixo) {
        pontosGanhos *= 2;
        console.log("⚡ GOLPE MERGULHADO! Dobro de pontos concedido: +" + pontosGanhos);
      }

      adicionarPontos(pontosGanhos);

      if (ent.tipo === 'bau') {
        curarHeroi(30);
        console.log("📦 Baú aberto! +30 HP restaurados.");
      } else {
        console.log("🗡️ Entidade (" + ent.tipo + ") destruída!");
      }

      ent.elementoDOM.remove();
      entidades.splice(i, 1);
      verificarCondicaoVitoria();
    }
  }
}
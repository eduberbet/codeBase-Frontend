// ==========================================
// MÓDULO DE ENTIDADES E GERENCIAMENTO DO MAPA
// ==========================================
let entidades = [];

function gerarPosicaoAleatoria(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gerarMapaProcedural() {
  limparEntidadesAnteriores();

  let containerPista = document.getElementById("pista");
  let tipos = ['bloco', 'espinho', 'bau'];

  // Instancia 6 entidades distribuídas pela pista
  for (let i = 0; i < 6; i++) {
    let minX = 350 + (i * 230);
    let maxX = 500 + (i * 230);
    let posX = gerarPosicaoAleatoria(minX, maxX);
    let tipoSorteado = tipos[i % tipos.length];

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
// SISTEMA DE ATAQUE CORPO A CORPO (FACA)
// ==========================================
function atacarComFaca() {
  let containerPista = document.getElementById("pista");

  // Orientação do golpe baseada na direcaoOlhar (1 = Direita, -1 = Esquerda)
  let facaX = (direcaoOlhar === 1) ? (posX + 40) : (posX - 30);
  let facaLargura = 30;

  // 1. Instanciação visual no DOM
  let elFaca = document.createElement("div");
  elFaca.className = "faca";
  elFaca.style.left = facaX + "px";
  containerPista.appendChild(elFaca);

  // 2. Remoção visual após 300ms
  setTimeout(function() {
    elFaca.remove();
  }, 300);

  // 3. Checagem de colisão da faca contra as entidades
  for (let i = entidades.length - 1; i >= 0; i--) {
    let ent = entidades[i];

    let acertouX = (facaX + facaLargura >= ent.x) && (facaX <= ent.x + ent.largura);
    let acertouY = (posY <= 20 + ent.altura);

    if (acertouX && acertouY) {
      if (ent.tipo === 'bau') {
        // Abrir baú restaura vida
        curarHeroi(30);
        console.log("📦 Baú aberto! +30 HP restaurados.");
        ent.elementoDOM.remove();
        entidades.splice(i, 1);
      } else {
        // Blocos e Espinhos são destruídos
        console.log("🗡️ Entidade (" + ent.tipo + ") destruída na posição: " + ent.x + "px!");
        ent.elementoDOM.remove();
        entidades.splice(i, 1);

        // Verifica vitória ao destruir um espinho
        verificarCondicaoVitoria();
      }
    }
  }
}
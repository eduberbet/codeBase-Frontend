// ==========================================
// MÓDULO DE ENTIDADES E GERENCIAMENTO DO MAPA
// ==========================================
let entidades = [];
let flechasAtivas = [];

function gerarPosicaoAleatoria(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gerarMapaProcedural(qtdEspinhos) {
  limparEntidadesAnteriores();

  let containerPista = document.getElementById("pista");
  let tiposBase = ['bloco', 'bau'];

  // 1. Gera Espinhos
  for (let i = 0; i < qtdEspinhos; i++) {
    let minX = 300 + (i * 200);
    let maxX = 450 + (i * 200);
    let posX = gerarPosicaoAleatoria(minX, maxX);
    criarEntidadeNoDOM(containerPista, 'espinho', posX);
  }

  // 2. Preenche com Blocos e Baús
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
    yBase: 20, // Altura padrão do chão
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
  
  for (let f of flechasAtivas) {
    if (f.elementoDOM) f.elementoDOM.remove();
  }
  flechasAtivas = [];
}

// ==========================================
// SISTEMA DE TIRO (ARCO E FLECHA / TENSÃO KEY Q)
// ==========================================
function dispararArco(tempoCarregamento) {
  let containerPista = document.getElementById("pista");
  let elFlecha = document.createElement("div");
  elFlecha.className = "flecha";
  
  // Parâmetros base da flecha
  let flechaObj = {
    x: posX + (direcaoOlhar === 1 ? 30 : -15),
    y: posY + 20,
    vx: 0,
    vy: 0,
    largura: 25,
    altura: 6,
    danoAtivo: true,
    elementoDOM: elFlecha,
    critico: false
  };

  // MÁQUINA DE ESTADOS: Regras baseadas no Tempo Segurado (T)
  if (tempoCarregamento < 200) {
    // 1. Backfire (MUITO RÁPIDO) -> Despenca no próprio herói ou voa pra trás
    console.log("Falha (Backfire) - Toque muito rápido!");
    flechaObj.vx = -2 * direcaoOlhar;
    flechaObj.vy = 8;
  } 
  else if (tempoCarregamento >= 200 && tempoCarregamento < 1200) {
    // 2. Parábola Normal -> Força baseada no tempo
    let multiplicador = tempoCarregamento / 1000; // 0.2 a 1.2
    flechaObj.vx = (10 + (10 * multiplicador)) * direcaoOlhar;
    flechaObj.vy = 6;
  } 
  else if (tempoCarregamento >= 1200 && tempoCarregamento <= 1500) {
    // 3. Crítico (Linear) -> Sem gravidade, tiro reto acelerado
    console.log("TIRO CRÍTICO (Linear)!");
    flechaObj.vx = 25 * direcaoOlhar;
    flechaObj.vy = 0;
    flechaObj.critico = true;
    elFlecha.classList.add("critico");
  } 
  else {
    // 4. Overcharge (Desgovernado) -> Perdeu o timing
    console.log("Overcharge! (Tiro Desgovernado)");
    flechaObj.vx = (Math.random() * 20) * direcaoOlhar;
    flechaObj.vy = -5 + (Math.random() * 15);
  }

  // Adiciona ao DOM e à lista de rastreio de vetores
  containerPista.appendChild(elFlecha);
  flechasAtivas.push(flechaObj);
}

function atualizarFisicaFlechas() {
  for (let i = flechasAtivas.length - 1; i >= 0; i--) {
    let f = flechasAtivas[i];

    // Atualiza posição vetor
    f.x += f.vx;
    f.y += f.vy;
    
    // Aplica gravidade somente se não for crítico
    if (!f.critico) {
      f.vy -= (gravidade * 0.5); // Flechas caem mais devagar que o Herói
    }

    // Atualiza visual DOM
    f.elementoDOM.style.left = f.x + "px";
    f.elementoDOM.style.bottom = f.y + "px";

    // Destruição fora da tela ou no chão
    if (f.y <= 20 || f.x > 1800 || f.x < 0) {
      // Se for um backfire ou cair perto do Herói (Auto-dano)
      if (f.y <= 20 && f.danoAtivo && (f.x > posX - 20 && f.x < posX + 60)) {
         vida -= 15;
         console.log("💥 Flecha caiu no Herói! -15 HP");
         if(typeof atualizarBarraVida === "function") atualizarBarraVida();
         if (vida <= 0) {
            vida = 0;
            if(typeof encerrarJogo === "function") encerrarJogo(false);
         }
      }
      f.elementoDOM.remove();
      flechasAtivas.splice(i, 1);
      continue;
    }

    // Checagem de colisão da Flecha contra Entidades do Mapa
    for (let j = entidades.length - 1; j >= 0; j--) {
      let ent = entidades[j];
      let acertouX = (f.x + f.largura >= ent.x) && (f.x <= ent.x + ent.largura);
      let acertouY = (f.y <= 20 + ent.altura) && (f.y + f.altura >= 20);

      if (acertouX && acertouY && f.danoAtivo) {
        // Impacto e cálculo de pontos
        let pontosGanhos = Math.floor(50 / qtdEspinhosAtual); // Flecha dá menos base que faca
        if (f.critico) pontosGanhos *= 3; // Crítico recompensa muito
        
        adicionarPontos(pontosGanhos);

        if (ent.tipo === 'bau') {
           curarHeroi(30);
        }
        
        // Destroi entidade e flecha
        ent.elementoDOM.remove();
        entidades.splice(j, 1);
        f.elementoDOM.remove();
        flechasAtivas.splice(i, 1);
        verificarCondicaoVitoria();
        break; // Interrompe loop de entidades pois flecha foi destruída
      }
    }
  }
}
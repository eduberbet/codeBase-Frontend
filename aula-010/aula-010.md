# codeBase: Frontend (`codeBase-frontend`)

## Aula 010 — Modularização de CSS, Arquearia com Carga de Tensão (Tecla Q) e Physics Debugger (Plataformização)

### 1. Introdução: Arquitetura CSS Avançada, Mecânicas de Risco/Recompensa e Física de Plataforma

Seja bem-vindo à **`aula-010`**!

Na aula anterior, implementamos temas de acessibilidade, seleção de dificuldade procedural e o ataque mergulhado (*Pound Down*).

À medida que o projeto cresce, a complexidade visual e mecânica exige evolução arquitetural e correções de física de precisão. Nesta aula, abordaremos:

1. **Modularização do CSS:** Divisão das regras visuais em dois arquivos especialistas (`style-menus.css` para telas/HUD/A11y e `style-jogo.css` para a arena, físicas e animações).
2. **Mecânica Avançada de Carga de Tensão (Arco & Flecha com Tecla `Q`):** Sistema de disparo baseado em tempo de retenção da tecla, apresentando 4 estados distintos de tiro (Backfire Rápido, Tiro Parabólico Variável, Tiro Crítico Reto e Tiro Desgovernação/Overcharge).
3. **Physics Debugger (Plataformização e Top Collision):** Resolução de colisão superior para permitir que o Herói aterrilhe e caminhe sobre o topo dos blocos cinzas.
4. **Fixação Dinâmica de Hitbox (*Pound Down Sync*):** Ancoragem em tempo real da faca ao corpo do Herói durante a queda acelerada.

---

### 2. `glossario.tech` (Novidades da Aula 010)

#### 🧱 CSS & Arquitetura Frontend

* **Separation of Concerns (SoC) em CSS:** Organização do código estilístico em múltiplos arquivos para facilidade de manutenção e prevenção de arquivos espaguete.
* **`<link rel="stylesheet">` Múltiplo:** Inclusão de múltiplos arquivos CSS no cabeçalho do documento HTML respeitando a ordem de especificidade.

#### 🧠 JavaScript & Mecânicas de Jogo

* **Key Press Duration (Duração de Pressão de Tecla):** Cálculo da diferença entre `performance.now()` nos eventos `keydown` e `keyup` para medir a tensão do arco.
* **Physics Trajectory (Trajetória Parabólica vs. Linear):** Cálculo de projéteis com componente de gravidade (`velocidadeY`) e velocidade horizontal (`velocidadeX`).
* **One-Way / Top-Down Collision:** Detecção da parte inferior do Herói aterrissando na superfície superior de objetos sólidos.

---

### 3. A Mecânica do Arco (Tecla `Q`): 4 Estados de Tensão

O sistema de arquearia exige precisão do jogador. Ao segurar e soltar a tecla `Q`, o tempo decorrido ($\Delta t$) determina a física da flecha:

```
[ Tecla Q Pressionada ] ────►  Contador de Tensão (ms)
         │
         ├─► Soltou em < 200ms   ──► 1. BACKFIRE (Flecha sobe e acerta o Herói! -15 HP)
         ├─► Soltou 200ms - 800ms ──► 2. PARÁBOLA (Alcance proporcional ao tempo)
         ├─► Soltou 800ms - 1000ms──► 3. CRÍTICO (Tiro reto direto e letal!)
         └─► Soltou > 1000ms     ──► 4. OVERCHARGE (Tiro desgovernado sem dano)
```

1. **Toque Rápido ($\Delta t < 200\text{ms}$):** Punição por toque afobado. A flecha sobe verticalmente e cai sobre o Herói, causando $-15\text{ HP}$.
2. **Pressão Normal ($200\text{ms} \le \Delta t \le 800\text{ms}$):** A flecha é lançada em um arco parabólico cuja distância horizontal e impulso inicial dependem da duração.
3. **Tiro Crítico ($800\text{ms} < \Delta t \le 1000\text{ms}$):** Ponto ideal de tensão. A flecha viaja em linha reta com alta velocidade, atravessando a arena.
4. **Overcharge ($\Delta t > 1000\text{ms}$):** O arco perde a tensão por ser mantido puxado por muito tempo. A flecha sai desgovernada sem acertar alvos.

---

### 4. Physics Debugger: Pouso em Blocos e Rastreio da Faca Aérea

#### A - Aterrissagem e Caminhada sobre Blocos
Para transformar os blocos em plataformas sólidas sobre as quais o Herói pode caminhar, a verificação de física foi expandida:

$$
\text{Se } (\text{posY} \ge \text{topoBloco}) \text{ e } (\text{posY} + \text{velocidadeY} \le \text{topoBloco})
$$

Se o Herói estiver caindo e sua parte inferior cruzar a superfície superior do bloco, sua posição vertical é cravada na altura do topo do bloco (`posY = 20 + bloco.altura`), zerando a `velocidadeY` e permitindo a movimentação normal sobre a estrutura.

#### B - Rastreio Dinâmico da Hitbox no Pound Down
No ataque mergulhado, a faca é vinculada ao loop de atualização a 60 FPS, garantindo que suas coordenadas sigam a posição `posX` e `posY` do Herói a cada quadro durante toda a velocidade de descida.

---

### 5. Código-Fonte Modularizado

#### `index.html`
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>codeBase - Aula 010: Arquearia de Tensão e Plataformização</title>
  <!-- MODULARIZAÇÃO CSS -->
  <link rel="stylesheet" href="style-menus.css">
  <link rel="stylesheet" href="style-jogo.css">
</head>
<body class="tema-padrao">

  <!-- MENU INICIAL -->
  <div id="painel-menu">
    <h2>🎮 Configurações da Partida</h2>
    
    <div class="campo-config">
      <label for="input-nome">Nome do Herói:</label>
      <input type="text" id="input-nome" placeholder="Digite o nome..." value="Valente">
    </div>

    <div class="campo-config">
      <label for="select-dificuldade">Dificuldade:</label>
      <select id="select-dificuldade">
        <option value="3">Fácil (3 Espinhos)</option>
        <option value="5" selected>Normal (5 Espinhos)</option>
        <option value="7">Difícil (7 Espinhos)</option>
      </select>
    </div>

    <div class="campo-config">
      <label for="select-tema">Tema de Contraste:</label>
      <select id="select-tema">
        <option value="tema-padrao">Padrão (Cyber Dark)</option>
        <option value="tema-alto-contraste">Alto Contraste (A11y)</option>
        <option value="tema-retro">Modo Retrô (Arcade)</option>
      </select>
    </div>

    <div class="campo-config">
      <label for="slider-brilho">Brilho da Arena:</label>
      <input type="range" id="slider-brilho" min="0.2" max="1" step="0.1" value="1">
    </div>

    <button id="btn-iniciar" onclick="iniciarJogo()">⚔️ Iniciar Corrida</button>
  </div>

  <!-- HUD E ARENA -->
  <div id="hud" class="oculto">
    <span id="label-heroi">Herói: Valente</span>
    <span id="label-pontos">Pontos: 0</span>
    
    <div id="barra-container">
      <div id="barra-vida"></div>
    </div>
  </div>

  <div id="arena" class="oculto">
    <div id="pista">
      <div id="heroi"></div>
      <div id="indicador-arco" class="oculto"></div>
    </div>
  </div>

  <!-- GAME OVER -->
  <div id="painel-game-over" class="oculto">
    <h2>☠️ GAME OVER</h2>
    <p id="msg-derrota"></p>
    <button id="btn-reiniciar" onclick="reiniciarParaMenu()">🔄 Voltar ao Menu Inicial</button>
  </div>

  <!-- VITÓRIA -->
  <div id="painel-vitoria" class="oculto">
    <h2>🏆 VITÓRIA!</h2>
    <p id="msg-vitoria"></p>
    <button id="btn-vitoria" onclick="reiniciarParaMenu()">🔄 Jogar Novamente</button>
  </div>

  <!-- MÓDULOS JS -->
  <script src="entidades.js"></script>
  <script src="jogo.js"></script>
</body>
</html>
```

---

### 6. Exercícios de Fixação

1. **Testando os 4 Estados do Arco:** Pressione a tecla `Q` rapidamente e observe o ataque contra o próprio Herói (*Backfire*). Em seguida, tente segurar a tecla por cerca de 0,9 segundos para disparar o Tiro Crítico reto.
2. **Desafio de Plataforma:** Pule em cima de um bloco cinza e verifique se o Herói consegue ficar parado na parte superior sem atravessar a estrutura.

### ⚙️ Bloco Hardcore: 

#### A - Matemática de Projéteis, Máquina de Estados Temporais e Coesão de DOM
Na programação de motores de jogos web (game engines), gerenciar ações baseadas no tempo segurado de uma tecla exige o controle rigoroso de loops de atualização (60 FPS) e o isolamento de efeitos colaterais (side effects) no DOM. Abaixo, detalhamos os conceitos de engenharia aplicados na mecânica de tiro com o arco (Tecla Q).1. O Ciclo de Vida do Disparo por Tensão (Charging Mechanics)Diferente de um gatilho binário comum (keydown instantâneo), a mecânica do arco opera sob uma Máquina de Estados de Tensão Temporal:Início (keydown para KeyQ): Registramos o exato carimbo de tempo do sistema (performance.now() ou Date.now()) e ativamos a flag carregandoArco = true.Janela de Acúmulo (Loop de Jogo): A cada frame, calculamos o delta de tempo (tempoAtual - tempoInicio). É esse delta que determina a força e a geometria da parábola.Resolução (keyup para KeyQ): O momento em que a tecla é solta avalia o estado acumulado em quatro quadrantes de punição e recompensa:JavaScriptlet tempoInicioArco = 0;
```javascript
let carregandoArco = false;

window.addEventListener("keydown", function(e) {
  if (e.code === "KeyQ" && estadoJogo === 'JOGANDO' && !carregandoArco) {
    carregandoArco = true;
    tempoInicioArco = performance.now();
  }
});

window.addEventListener("keyup", function(e) {
  if (e.code === "KeyQ" && carregandoArco) {
    carregandoArco = false;
    let tempoPressionado = performance.now() - tempoInicioArco;
    
    dispararArco(tempoPressionado);
  }
});
```

#### B - Modelagem Matemática dos 4 Comportamentos do Projétil
Dentro da função dispararArco(tempo), o motor analisa o escopo temporal e aplica regras matemáticas distintas:
###### Backfire ($T < 200\text{ms}$): 
Toque rápido demais. O vetor de velocidade horizontal inverte o sentido ou aponta diretamente para cima, fazendo a flecha despencar sobre o próprio Herói.
###### Parábola Padrão ($200\text{ms} \le T \le 1200\text{ms}$): 
Aplicamos a equação quadrática de movimento balístico no DOM, onde a altura máxima $y(x)$ é proporcional à força acumulada:$$y = x \cdot \tan(\theta) - \frac{g \cdot x^2}{2 \cdot v_0^2 \cdot \cos^2(\theta)}$$
###### Tiro Crítico Linear ($1200\text{ms} \le T \le 1500\text{ms}$): 
A aceleração vertical é zerada ($\vec{a}_y = 0$), convertendo o projétil em um raio laser horizontal de alta velocidade.
###### Overcharge ($T > 1500\text{ms}$): 
A corda do arco "estoura" por excesso de tensão. O objeto perde massa útil e ganha um vetor de ruído estocástico (aleatório), saindo completamente desgovernado.

#### C - Otimização de Memória e Reconciliação do DOM
Como o jogo roda a 60 quadros por segundo em Vanilla JS, criar elementos dinamicamente sem limpeza prévia causa Memory Leaks e Garbage Collection (GC) travamentos perceptíveis.O uso de referências controladas garante que cada flecha ou rastro instanciado seja rastreado por um array de instâncias ativas (flechasAtivas) e purgado imediatamente assim que colide com uma entidade (AABB Collision) ou atinge os limites da arena.Pode adicionar este conteúdo na sua apostila da Aula 010 para fechar com o rigor técnico de engenharia que o nosso curso exige! Se precisar de mais algum complemento, é só chamar.
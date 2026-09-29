# codeBase: Frontend (`codeBase-frontend`)
## Aula 005 — Controles de Teclado, Movimentação 2D e Acessibilidade

---

### 1. Introdução: Liberdade de Movimento e a Era dos Jogos Teclados

Seja bem-vindo à **`aula-005`**! Nas aulas anteriores, organizamos o projeto na "Trinca da Web" (`index.html`, `style.css` e `script.js`) e criamos o painel para dar um nome ao nosso Herói.

**O Nosso Desafio Hoje:**
Até agora, a única forma de interagir com o jogo era clicando diretamente na bola com o mouse para fazê-la pular. Convenhamos: nenhum jogo de arena 2D divertido é jogado clicando na bolinha! 

Hoje vamos dar vida completa ao Herói:
1. **Movimentação 2D Real (Eixo X e Y):** O aluno aprenderá a mapear as teclas do teclado (**A / D**, **Setas** ou **Espaço**) para que o Herói ande livremente pela arena e pule, com detecção das paredes para não "vazar" da tela.
2. **Eventos Globais da Janela (`keydown`):** Entenderemos como o navegador captura o pressionar de teclas em tempo real.
3. **Painel de Acessibilidade e Configurações:** Construiremos um painel de controles com componentes nativos (`<input type="range">` para brilho e `<input type="checkbox">` para modo narrador).

---

### 2. `glossario.tech` (Novidades da Aula 005)

> 💡 *Nota: Consulte os glossários das Aulas anteriores sempre que precisar relembrar seletores, tags ou funções passadas.*

#### 🧱 HTML (Esqueleto)
* **`<input type="range">`**: Componente de formulário que gera um *slider* (barra deslizante) numérico para seleção de valores contínuos (ex: brilho, volume).
* **`<input type="checkbox">`**: Caixa de seleção para estados binários (*marcado/desmarcado* ou *verdadeiro/falso*).

#### 🎨 CSS (Aparência e Estilo)
* **`opacity`**: Propriedade que controla o nível de transparência visual de um elemento HTML (de `0` para totalmente invisível a `1` para totalmente opaco).

#### 🧠 JavaScript (Cérebro e Lógica)
* **`window.addEventListener("keydown", callback)`**: Registra um ouvinte global que intercepta qualquer tecla pressionada no teclado pelo usuário.
* **`event.code`**: Propriedade do evento de teclado que indica qual tecla física foi acionada (ex: `"KeyA"`, `"ArrowRight"`, `"Space"`).
* **`event.preventDefault()`**: Comando que cancela a ação padrão do navegador para determinada tecla (como impedir que a Barra de Espaço role a página para baixo).
* **`switch (expressao) / case`**: Estrutura condicional para avaliar múltiplos cenários possíveis de forma limpa e organizada.
* **Colisão Primitiva com Paredes (*Boundary Check*)**: Trava lógica que impede a coordenada de ultrapassar o tamanho máximo ou mínimo da arena (`if (posX < 0) posX = 0`).

---

### 3. Passo a Passo da Refatoração

---

#### Passo 1: Adicionando o Painel de Acessibilidade no HTML (`index.html`)

Abra seu arquivo `index.html` e adicione o painel de configurações logo abaixo da `<div id="arena">`:

```html
  <!-- Arena do jogo -->
  <div id="arena">
    <div id="heroi" onclick="executarPuloSuicida()"></div>
  </div>

  <!-- NOVO (Aula 005): Painel de Acessibilidade e Configurações -->
  <div id="painel-acessibilidade">
    <div class="campo-config">
      <label for="slider-brilho">Brilho da Arena:</label>
      <input type="range" id="slider-brilho" min="0.2" max="1" step="0.1" value="1">
    </div>

    <div class="campo-config">
      <label for="check-narrador">Modo Narrador (Console):</label>
      <input type="checkbox" id="check-narrador">
    </div>
  </div>

  <script src="script.js"></script>
</body>
```
#### Passo 2: Estilizando o Painel de Acessibilidade no CSS (style.css)No final do arquivo style.css, insira as regras visuais para o painel de configurações e ajuste a transição da opacidade da arena:
```CSS
/* NOVO (Aula 005): Transição suave de transparência na Arena */
#arena {
  width: 600px;
  height: 300px;
  background-color: #202024;
  border: 2px solid #41414d;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  transition: opacity 0.2s ease;
}

/* NOVO (Aula 005): PAINEL DE ACESSIBILIDADE */
#painel-acessibilidade {
  margin-top: 15px;
  background-color: #202024;
  padding: 10px 20px;
  border-radius: 6px;
  border: 1px solid #41414d;
  display: flex;
  gap: 20px;
  align-items: center;
}

.campo-config {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

#slider-brilho {
  cursor: pointer;
}
```
#### Passo 3: Implementando os Controles 2D e Acessibilidade no JS (script.js)Abra o arquivo script.js. Vamos atualizar as variáveis de posição do Herói e criar o ouvinte de teclado global:
```JavaScript
// ESTADO DO JOGO EM VARIÁVEIS NA MEMÓRIA
let nomeHeroi = "Valente";
let vida = 100;
let maxVida = 100;

// NOVO (Aula 005): POSICIONAMENTO 2D NA ARENA
let posX = 50;        // Posição horizontal (Eixo X - Left)
let posY = 20;        // Posição vertical (Eixo Y - Bottom)
let velocidadeX = 15; // Distância em pixels percorrida a cada tecla

// NOVO (Aula 005): ESCUTA GLOBAL DE EVENTOS DE TECLADO
window.addEventListener("keydown", function(event) {
  let elementoHeroi = document.getElementById("heroi");

  // Se o Herói estiver morto, não atende aos comandos
  if (vida <= 0) return;

  switch (event.code) {
    // ⬅️ MOVER PARA A ESQUERDA (Seta Esquerda ou Tecla A)
    case "ArrowLeft":
    case "KeyA":
      event.preventDefault();
      posX -= velocidadeX;
      
      // Colisão com a parede esquerda da arena (0px)
      if (posX < 0) posX = 0;
      
      elementoHeroi.style.left = posX + "px";
      narrarAcao(nomeHeroi + " moveu para a esquerda.");
      break;

    // ➡️ MOVER PARA A DIREITA (Seta Direita ou Tecla D)
    case "ArrowRight":
    case "KeyD":
      event.preventDefault();
      posX += velocidadeX;

      // Colisão com a parede direita (Largura 600px - Herói 40px = 560px)
      if (posX > 560) posX = 560;

      elementoHeroi.style.left = posX + "px";
      narrarAcao(nomeHeroi + " moveu para a direita.");
      break;

    // ⬆️ PULAR (Espaço, Seta Cima ou Tecla W)
    case "Space":
    case "ArrowUp":
    case "KeyW":
      event.preventDefault(); // Impede a página de rolar com o Espaço
      executarPuloSuicida();
      break;

    // 💚 CURAR (Tecla C)
    case "KeyC":
      curarHeroi();
      break;
  }
});

// NOVO (Aula 005): CONTROLE DO SLIDER DE BRILHO DA ARENA
let sliderBrilho = document.getElementById("slider-brilho");
sliderBrilho.addEventListener("input", function() {
  let arena = document.getElementById("arena");
  arena.style.opacity = sliderBrilho.value;
  narrarAcao("Brilho ajustado para " + Math.round(sliderBrilho.value * 100) + "%");
});

// NOVO (Aula 005): FUNÇÃO AUXILIAR DO NARRADOR
function narrarAcao(texto) {
  let checkNarrador = document.getElementById("check-narrador");
  if (checkNarrador.checked) {
    console.log("📢 [NARRADOR]: " + texto);
  }
}
```

### 4. Desafio Prático
No script.js, altere a variável velocidade X para 30 e observe como o Herói passa a dar passos mais longos na arena.
Tente adicionar uma trava no slider Brilho para que o brilho nunca caia abaixo de 0.2 (20%), evitando que a arena fique totalmente invisível na tela.

### 🔥 Aprofundamento Hardcore (Bastidores da Engenharia)

#### A - Mapeamento de Teclas Físicas (event.code) vs Caracteres (event.key)
Ao registrar eventos de teclado, o uso de event.code ("KeyA", "Space") identifica a posição física da tecla no teclado, independentemente do idioma ou layout configurado (ABNT2, US, Dvorak). Já a propriedade event.key retornaria a letra processada ("a", "A", "á"), o que poderia gerar falhas de movimentação se o usuário estivesse com a tecla Caps Lock ativada.
#### B - Propagação de Eventos no DOM (Event Bubbling)
Quando uma tecla é pressionada, o evento de teclado não nasce direto no elemento do Herói, mas sim no topo da hierarquia do navegador (window / document). O evento desce a árvore de nós e depois sobe (bubbling). Registrar o escutador em window garante que o jogo capturará os comandos do teclado independentemente de onde o foco de clique do mouse esteja na página.
#### C - A Matemática das Colisões de Borda (Bounding Box Boundary)
Para limitar a movimentação do herói à direita da arena em 560px, calculamos:
$$\text{Posição Máxima} = \text{Largura da Arena} (600\text{px}) - \text{Largura do Herói} (40\text{px}) = 560\text{px}$$
Sem essa subtração do diâmetro do próprio elemento, o herói ultrapassaria a borda direita antes de travar, expondo apenas sua metade na tela.
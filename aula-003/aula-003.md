# codeBase: Frontend (`codeBase-frontend`)
## Aula 003 — Indicadores de Estado e Barras de Vida Dinâmicas

---

### 1. Introdução: O HP Além dos Números e a Psicologia Visual nos Jogos

Seja bem-vindo à **`aula-003`**! Na aula anterior, corrigimos o "Bug do Defunto" com o uso de `if/else`, aplicamos a história da Grace Hopper para entender o que é depuração (*debugging*) e adicionamos o nosso primeiro botão de cura.

**O Nosso Problema Hoje:**
Atualmente, a vida do Herói é informada como um texto estático no placar (`100 HP`). Em termos de experiência do usuário (*UX*) e *game design*, números puros exigem leitura analítica e atrasam a tomada de decisão do jogador no meio do combate.

Como transformamos esse dado da memória em uma **Barra de Vida CSS** que enche, encolhe e muda de cor suavemente conforme o estado de saúde do Herói muda no JavaScript?

Vamos refatorar o arquivo `index.html` substituindo o texto do placar por um componente gráfico de barra de progresso, manipulado dinamicamente via JS e estilizado com transições de CSS3! Mas antes...

### 2. UX? Game design? 

Até agora falamos muito sobre código, variáveis e estilização. Mas já parou para pensar em como o jogador se **sente** quando entra no seu jogo? É aqui que entram dois conceitos fundamentais de qualquer produto digital:

#### 🎨 UX (User Experience / Experiência do Usuário)
UX é o estudo de como uma pessoa interage com um sistema e se essa experiência é clara, intuitiva e agradável.
* **UX Ruim:** O botão de "Pular" é pequenininho no canto da tela, a cor do texto se confunde com o fundo e o jogador não sabe se a vida dele está cheia ou vazia.
* **UX Boa:** A barra de vida fica sempre visível e em destaque, os botões têm tamanhos fáceis de clicar e as cores dão pistas claras do que está acontecendo (verde para vida cheia, vermelho para dano).

#### 🎮 Game Design (Design de Jogos)
Game Design não é sobre desenhar gráficos bonitos, mas sim sobre **definir as regras, as mecânicas e a sensação do jogo**. É a arte de responder perguntas como:
* Qual é o tamanho da arena para o jogador não se sentir claustrofóbico?
* Qual é o contraste entre o herói e o chão para que o olho do jogador encontre o personagem instantaneamente?
* A física do pulo parece fluida ou pesada?

> 💡 **O Toque do Sensei:** 
> Código perfeito com uma UX péssima resulta em um jogo chato que ninguém quer jogar. Quando definimos a altura da arena, a cor escura do fundo e o destaque do Herói, não estamos apenas aplicando CSS — estamos projetando a **primeira interface de uso** do nosso jogador!

---

### 3. `glossario.tech` (Novidades da Aula 003)

> 💡 *Nota: Consulte os glossários das aulas anteriores sempre que precisar relembrar tags, seletores ou funções ja abordadas.*

#### 🧱 HTML (Esqueleto)
* **`Estrutura de Barra Aninhada`**: Padrão de interface onde uma `<div>` externa atua como contêiner/fundo (limite da barra) e uma `<div>` interna atua como o preenchimento colorido ajustável.

#### 🎨 CSS (Aparência e Estilo)
* **`overflow: hidden`**: Propriedade no elemento pai que esconde qualquer conteúdo filho que extrapole as suas bordas (útil para cantos arredondados).
* **`transition: width 0.3s ease, background-color 0.3s ease`**: Anima suavemente as alterações de largura e cor enviadas pelo JavaScript, criando a sensação de preenchimento fluido.

#### 🧠 JavaScript (Cérebro e Lógica)
* **`Normalização por Porcentagem`**: A fórmula matemática `(vidaAtual / vidaMaxima) * 100` que converte qualquer valor numérico de HP em uma escala escalar de `0` a `100%`.
* **`.style.width`**: Propriedade JS que altera a largura de um elemento HTML em tempo de execução (`elemento.style.width = porcentagem + "%"`).
* **`else if (condicao)`**: Estrutura condicional encadeada que permite testar múltiplos cenários em sequência (ex: HP Alto > HP Médio > HP Crítico).

---

### 4. Passo a Passo da Refatoração

Abra o seu arquivo `index.html` e aplique as alterações localizando as âncoras no seu código:

#### Passo 1: Adicionando os Estilos da Barra no CSS
No seu `<style>`, vamos incluir as regras de visualização do contêiner da barra e do seu preenchimento.

Localize a regra `#hud` e insira as novas regras de estilo logo abaixo:

```css
    #hud {
      margin-bottom: 15px;
      font-size: 1.2rem;
      display: flex;
      gap: 15px;
      align-items: center;
    }

    #barra-container {
      width: 200px;
      height: 20px;
      background-color: #41414d;
      border-radius: 10px;
      overflow: hidden;
      border: 2px solid #7c7c8a;
    }

    #barra-vida {
      width: 100%;
      height: 100%;
      background-color: #04d361;
      transition: width 0.3s ease, background-color 0.3s ease;
    }

    #btn-curar {
      background-color: #04d361;
      color: #000000;
```

#### Passo 2: Substituindo o Placar de Texto pela Barra no HTML
Na sua <div id="hud">, troque a tag <span> que exibia o número pelo novo componente visual da barra.Localize o bloco do <body>:

```html
HTML<body>

  <div id="hud">
    <div id="barra-container">
      <div id="barra-vida"></div>
    </div>
    <button id="btn-curar" onclick="curarHeroi()">Usar Poção (+25 HP)</button>
  </div>

  <div id="arena">
```
#### Passo 3: Criando a Função de Atualização Visual no JavaScript
Para evitar duplicação de código (DRY — Don't Repeat Yourself), criaremos a função atualizarBarraVida(). Ela calcula a porcentagem de HP, altera a largura no DOM e ajusta a cor conforme a gravidade do dano.No seu <script>, substitua o trecho de atualização do texto antigo por chamadas para esta nova função e adicione-a no final:

```javascript
JavaScript        
    if (vida <= 0) {
          vida = 0;
          elementoHeroi.style.backgroundColor = "#e83f5b";
          document.getElementById("btn-curar").disabled = true;
          alert("☠️ Game Over! O Herói morreu e não pode mais pular nem se curar.");
        }

    atualizarBarraVida();

    setTimeout(function()
        if (vida > 0) {
            posicaoY = 20;
            elementoHeroi.style.bottom = posicaoY + "px";
        }
        , 200);
         else {
        console.log("🚫 Ação ignorada: O Herói está morto.");
    }
    
    function curarHeroi() {
      if (vida > 0 && vida < maxVida) {
        vida += 25;

        if (vida > maxVida) {
          vida = maxVida;
        }

        atualizarBarraVida();
        console.log("💚 Herói curado! HP atual: " + vida);
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
  </script>
  ```
### 5. Desafio Prático
Com as alterações salvas no seu navegador:
Tente alterar as condições da função atualizarBarraVida() para que a barra só fique amarela abaixo de 40% e fique azul quando a vida estiver em 100%.
Tente alterar o estilo do #barra-container no CSS para adicionar uma sombra suave (box-shadow: 0 0 10px rgba(0,0,0,0.5)).

#### 🔥 Aprofundamento Hardcore (Bastidores da Engenharia)

#### A - A Árvore do DOM e o Modelo de Caixas (Box Model)
Quando o navegador lê o HTML e o CSS da arena, ele constrói a DOM Tree e a Render Tree. Cada nó na tela é traduzido em uma caixa retangular (Box Model) com dimensões de largura, altura, margens e bordas na memória. Quando aplicamos position: relative na #arena e position: absolute no #heroi, instruímos o navegador a criar um novo sistema de coordenadas local dentro daquela caixa pai, retirando o herói do fluxo normal de leitura.

#### B - Especificidade do CSS (CSS Specificity Engine)
Como o navegador decide qual regra visual aplicar quando há conflitos? Através de um cálculo de peso binário:

1. Tags puras (div, span): Peso 1.

2. Classes (.heroi, .barra-vida): Peso 10.

3. IDs (#arena, #heroi): Peso 100.

4. Estilo Inline (style="..." via JS): Peso 1000.

No nosso jogo, alterar a barra de vida via elementoBarra.style.width no JS usa estilo inline (Peso 1000), garantindo que o JavaScript sempre tenha prioridade máxima sobre qualquer folha de estilo CSS estática.

#### C - O Ciclo de Renderização: Reflow, Paint e Compositor
Ao modificarmos elementoBarra.style.width ou as coordenadas $X/Y$ do Herói, o motor de renderização do navegador (Blink/Gecko) passa por três fases:Layout / Reflow: Recalcula a geometria e a posição das caixas na tela.Paint: Redesenha os pixels visuais (cores, bordas, sombras).Compositing: Junta as camadas na GPU. Por usarmos transition no CSS, o navegador delega o cálculo das animações intermediárias para a GPU, entregando um movimento fluido a 60 FPS sem sobrecarregar a CPU.

#### D - O Princípio DRY e a Normalização Matemática de Escala
Para atualizar a barra visualmente sem repetir código (Don't Repeat Yourself - DRY), isolamos a lógica na função atualizarBarraVida(). Usamos a fórmula matemática (vida / maxVida) * 100 para converter o estado interno em uma porcentagem normalizada entre $0\%$ e $100\%$. Isso garante agnosticismo de escala: se no futuro o Herói tiver $50$ HP ou $5.000$ HP, o componente visual responde com precisão absoluta sem precisarmos alterar uma linha de CSS.

# codeBase: Frontend (`codeBase-frontend`)
## Aula 003 — Indicadores de Estado e Barras de Vida Dinâmicas

---

### 1. Introdução: O HP Além dos Números e a Psicologia Visual nos Jogos

Seja bem-vindo à **`aula-003`**! Na aula anterior, corrigimos o "Bug do Defunto" com o uso de `if/else`, aplicamos a história da Grace Hopper para entender o que é depuração (*debugging*) e adicionamos o nosso primeiro botão de cura.

**O Nosso Problema Hoje:**
Atualmente, a vida do Herói é informada como um texto estático no placar (`100 HP`). Em termos de experiência do usuário (*UX*) e *game design*, números puros exigem leitura analítica e atrasam a tomada de decisão do jogador no meio do combate.

Como transformamos esse dado da memória em uma **Barra de Vida CSS** que enche, encolhe e muda de cor suavemente conforme o estado de saúde do Herói muda no JavaScript?

Hoje vamos refatorar o arquivo `index.html` substituindo o texto do placar por um componente gráfico de barra de progresso, manipulado dinamicamente via JS e estilizado com transições de CSS3!

---

### 2. `glossario.tech` (Novidades da Aula 003)

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

### 3. Passo a Passo da Refatoração

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
### 4. Desafio Prático
Com as alterações salvas no seu navegador:
Tente alterar as condições da função atualizarBarraVida() para que a barra só fique amarela abaixo de 40% e fique azul quando a vida estiver em 100%.
Tente alterar o estilo do #barra-container no CSS para adicionar uma sombra suave (box-shadow: 0 0 10px rgba(0,0,0,0.5)).

#### 🔥 Aprofundamento Hardcore (Bastidores da Engenharia)

#### A - O Princípio DRY (Don't Repeat Yourself) e Responsabilidade Única
Isolar a atualização da barra na função atualizarBarraVida() garante a Separação de Responsabilidades. A função do pulo trata da física/dano; a função da poção trata da recuperação; e a função da barra trata exclusivamente do reflexo visual do estado na tela.

#### B - Ciclo de Renderização do Navegador: Layout, Paint e Compositor
Quando modificamos elementoBarra.style.width, o motor de renderização do navegador (Blink/Gecko) dispara o estágio de Layout/Reflow (recalculando a geometria da página). Por usar a propriedade CSS transition, o navegador delega a interpolação dos quadros intermediários para a GPU do computador via etapa de Compositing, entregando uma animação a 60 FPS sem travar o código JS.

#### C - Agnosticismo de Escala por Normalização Matemática
A fórmula (vida / maxVida) * 100 é uma abstração escalar. Isso significa que, mesmo se no futuro mudarmos a vida do Herói para $5.000$ HP ou $50$ HP, a barra de vida continuará funcionando com precisão absoluta, pois o componente visual responde apenas a porcentagens normalizadas entre 0% e 100%.
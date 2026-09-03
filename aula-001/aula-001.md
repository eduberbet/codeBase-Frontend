# codeBase: Frontend (`codeBase-frontend`)
## Aula 001 — O Nascimento do Herói (Arquivo Único e A Bola Suicida)

---

### 1. Introdução: O Desafio do Herói Estático

Seja bem-vindo ao **codeBase-frontend**! Nesta primeira aula, vamos inaugurar o nosso jogo. 

Imagine que você foi contratado para criar um jogo de plataforma 2D em HTML5. Você precisa colocar o primeiro personagem na tela e fazer com que ele reaja quando o jogador clica nele. 

**O Nosso Problema Hoje:**
Se você usar apenas um documento de texto tradicional no navegador, a página fica 100% estática. É como tentar jogar um videogame onde os botões do controle não fazem nada. Como fazemos o computador desenhar o herói, posicioná-lo no chão de uma arena e responder aos nossos cliques de mouse em tempo real?

Para resolver isso, vamos entender as ferramentas básicas da Web e criar o nosso primeiro protótipo: **A Bola Suicida** — um herói em formato de círculo que pula quando você clica nele, mas que perde vida a cada pulo!

---

### 2. `glossario.tech` (As Peças da Aula)

Antes de montarmos o código, veja abaixo o significado de cada "tag", comando e propriedade nova que usaremos hoje.

#### 🧱 HTML (Esqueleto)
* **`<!DOCTYPE html>`**: O aviso que diz ao navegador: *"Este arquivo é um documento HTML5 moderno"*.
* **`<html lang="pt-BR">`**: A caixa principal que envolve todo o site. O atributo `lang="pt-BR"` avisa ao navegador e ao Google que o site está em português.
* **`<head>`**: A "cabeça" da página. Guarda informações invisíveis para o jogador, como o título da aba e as regras de estilo.
* **`<meta charset="UTF-8">`**: Configuração que garante que acentos (`á`, `ç`, `ã`) e emojis apareçam corretamente sem "bugar".
* **`<title>`**: O texto que aparece lá em cima, na aba do seu navegador.
* **`<body>`**: O "corpo" da página. Tudo o que você colocar aqui dentro aparece visualmente na tela para o jogador.
* **`<div>`**: A tag de "caixa" (divisão). Serve para agrupar elementos. Usamos `<div>` para criar a arena e o herói.
* **`id="..."`**: O RG único de uma caixa. Usamos para dizer ao CSS e ao JS exatamente com qual caixa estamos falando.
* **`<span>` / `<strong>`**: Tags de texto. O `<span>` guarda pequenos trechos de texto e o `<strong>` deixa o texto em negrito.
* **`onclick="..."`**: Um gatilho que diz ao HTML: *"Quando o usuário clicar nesta caixa, execute este comando de JavaScript"*.
* **`<style>`**: A caixa dentro do `<head>` onde escrevemos todo o nosso código CSS.
* **`<script>`**: A caixa dentro do `<body>` onde escrevemos todo o nosso código JavaScript.
* **`<!-- Comentário HTML -->`**: Anotação invisível no HTML. O navegador ignora completamente e não mostra na tela.

#### 🎨 CSS (Aparência e Estilo)
* **`background-color`**: A cor de fundo da caixa ou da página.
* **`color`**: A cor do texto.
* **`font-family`**: O tipo de fonte/letra usada nos textos.
* **`display: flex` / `align-items` / `justify-content`**: Comandos que organizam as caixas para que tudo fique perfeitamente centralizado na tela.
* **`width` / `height`**: A largura (`width`) e a altura (`height`) de uma caixa em pixels (`px`).
* **`border`**: A borda ao redor de uma caixa (espessura, estilo e cor).
* **`position: relative`**: Diz que a arena é uma "âncora" para quem estiver dentro dela.
* **`position: absolute`**: Dá liberdade total para posicionarmos o herói dentro da arena usando coordenadas em pixels.
* **`border-radius: 50%`**: Arredonda as bordas de uma caixa quadrada até ela virar um círculo perfeito.
* **`cursor: pointer`**: Faz a seta do mouse virar a mãozinha de clique quando passa por cima do herói.
* **`transition`**: Faz com que mudanças de posição aconteçam de forma suave em vez de darem "teletransporte".
* **`/* Comentário CSS */`**: Anotação invisível no CSS para organizar os blocos de código.

#### 🧠 JavaScript (Cérebro e Lógica)
* **`let`**: Cria uma variável (uma "gaveta" na memória do computador para guardar um número ou texto que pode mudar).
* **`function nomeDaFuncao() { ... }`**: Cria um bloco de comandos reutilizável que só é executado quando chamado.
* **`document.getElementById("...")`**: O comando que "pesca" uma caixa do HTML usando o `id` dela.
* **`.style.bottom = ...`**: Altera a posição vertical da caixa via código JS.
* **`alert("...")`**: Abre uma janela de aviso pop-up na tela do navegador.
* **`innerText = ...`**: Troca o texto escrito dentro de um elemento HTML.
* **`setTimeout(função, tempo)`**: Manda o computador esperar um determinado tempo (em milissegundos) antes de executar um comando.
* **`// Comentário JS`**: Anotação de linha única no JavaScript para explicar o que aquela linha faz.

---

### 3. Montando a Página (O Código na Prática)

Agora que você já conhece cada peça do nosso `glossario.tech`, vamos juntar tudo em um único arquivo!

1. Crie uma pasta no seu computador chamada **`jogo2d`**.
2. Abra o Bloco de Notas ou seu editor de código (como o VS Code).
3. Crie um arquivo com o nome **`index.html`** e cole o código abaixo:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>codeBase - Aula 001: A Bola Suicida</title>

  <style>
    /* 1. CONFIGURAÇÃO DO PALCO DA TELA */
    body {
      background-color: #121214;
      color: #ffffff;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }

    /* 2. A ARENA DO JOGO */
    #arena {
      width: 600px;
      height: 300px;
      background-color: #202024;
      border: 2px solid #41414d;
      position: relative; /* Funciona como âncora para o herói */
      overflow: hidden;
      border-radius: 8px;
    }

    /* 3. O HERÓI (A BOLA SUICIDA) */
    #heroi {
      width: 40px;
      height: 40px;
      background-color: #8257e5;
      border-radius: 50%; /* Caixa quadrada virando círculo */
      position: absolute;
      left: 50px;
      bottom: 20px;       /* Posição em cima do chão da arena */
      cursor: pointer;
      transition: bottom 0.1s; /* Pulo suave */
    }

    /* 4. PLACAR DE STATUS */
    #hud {
      margin-bottom: 15px;
      font-size: 1.2rem;
    }
  </style>
</head>
<body>

  <!-- Placar informando o HP atual -->
  <div id="hud">
    <span>Vida do Herói: <strong id="texto-vida">100</strong> HP</span>
  </div>

  <!-- Arena contendo o Herói -->
  <div id="arena">
    <div id="heroi" onclick="executarPuloSuicida()"></div>
  </div>

  <script>
    // ESTADO DO JOGO EM VARIÁVEIS
    let vida = 100;
    let posicaoY = 20;

    // Ação acionada pelo clique do jogador
    function executarPuloSuicida() {
      let elementoHeroi = document.getElementById("heroi");
      let elementoTextoVida = document.getElementById("texto-vida");

      // 1. O herói sobe (pulo)
      posicaoY = 100;
      elementoHeroi.style.bottom = posicaoY + "px";
      
      // 2. Perde 25 HP a cada pulo
      vida = vida - 25;

      // 3. Checa se o herói morreu
      if (vida <= 0) {
        vida = 0;
        elementoHeroi.style.backgroundColor = "#e83f5b"; // Cor vermelha de derrota
        alert("☠️ A Bola Suicida pulou e acabou com toda a vida!");
      }

      // 4. Atualiza o valor no placar visual
      elementoTextoVida.innerText = vida;

      // 5. Após 200 milissegundos, faz o herói cair de volta ao chão
      setTimeout(function() {
        if (vida > 0) {
          posicaoY = 20;
          elementoHeroi.style.bottom = posicaoY + "px";
        }
      }, 200);
    }
  </script>
</body>
</html>
```

### 4. Desafio Prático
Abra o arquivo index.html no seu navegador (basta dar dois cliques nele) e teste fazer estas 3 modificações:

No glossario.tech, vimos que vida = 100 é uma variável. Altere ela no código para 150.

No CSS do #heroi, mude a cor do herói de #8257e5 para green ou blue.

Altere a linha vida = vida - 25; para vida = vida - 10;. Quantos pulos o herói aguenta dar agora?

### 🔥 Aprofundamento Hardcore (Bastidores da Engenharia)
Nota: Esta seção traz o funcionamento interno do navegador. Se você é iniciante absoluto, pode focar no desafio acima e retornar aqui no futuro!

#### A- A Call Stack, Web APIs e o Event Loop
Quando o evento onclick dispara a função executarPuloSuicida(), o motor JS (como o V8) coloca essa execução dentro da Call Stack (Pilha de Execução de Thread Única).

O comando setTimeout não congela o navegador durante os 200ms. Ele registra o temporizador na Web API de Timers do navegador e esvazia a Call Stack imediatamente. Quando os 200ms expiram, o callback da queda é movido para a Callback Queue (Fila de Tarefas). O Event Loop monitora a Call Stack e, assim que ela fica livre, empurra a função de queda para ser executada.

#### B- Árvore DOM, Reflow e Repaint
Ao executar document.getElementById("heroi"), o JS consulta a árvore DOM (Document Object Model) na RAM. Quando alteramos .style.bottom, o navegador aciona um ciclo de Reflow (cálculo de posicionamento geométrico dos nós) e, em seguida, um Repaint (redesenho dos pixels alterados pela GPU).

#### C- Tipagem Dinâmica e Coerção
Na instrução elementoTextoVida.innerText = vida;, a variável vida armazena um Number. Como a propriedade innerText exige estritamente um tipo String, o motor JavaScript faz uma coerção implícita de tipo (Type Coercion), convertendo o número em formato textual de forma transparente antes da renderização.
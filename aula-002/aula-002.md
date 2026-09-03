# codeBase: Frontend (`codeBase-frontend`)
## Aula 002 — O Bug do Defunto e o Sistema de Cura (Estruturas Condicionais)

---

### 1. Introdução: O Problema do "Pulo Fantasma"

Na **`aula-001`**, construímos o nosso Herói (A Bola Suicida) e conseguimos fazê-lo pular e perder vida. Porém, se você testou o jogo com atenção, notou nosso primeiro **bug**:

#### 🪰 Mas, afinal... o que é um Bug? Tem uma mosca na minha sopa de código?

Quase isso! Na tecnologia, a palavra **Bug** (que em inglês significa *inseto*) é usada para descrever qualquer falha, erro ou comportamento inesperado em um sistema de computador.

A história mais famosa sobre a origem desse termo aconteceu em **1947**, com a cientista da computação e pioneira da programação **Grace Hopper**. Ela e sua equipe estavam trabalhando no *Harvard Mark II*, um computador gigante da Marinha americana que ocupava uma sala inteira. 

De repente, a máquina parou de funcionar. Ao abrirem o painel para investigar as peças, eles encontraram uma **mariposa real presa entre os contatos elétricos de um relé**! 

Grace Hopper removeu o inseto com uma pinça, colou-o no diário de bordo com uma fita adesiva e escreveu: 
> *"First actual case of bug being found"* (*Primeiro caso real de inseto/bug encontrado*).

A partir daquele dia, o ato de procurar e resolver falhas no código passou a ser chamado mundialmente de **Debugging** (ou *Depuração*). Mas deixando o bug da Grace de lado e voltando ao nosso...

--- 

**O Nosso Problema Hoje:**
Quando a vida do Herói chega a `0`, a tela avisa que deu *Game Over* e a bolinha fica vermelha. Mas se você continuar clicando nela, **a bolinha continua pulando mesmo depois de morta!**

Além disso, nosso herói só perde vida, sem nenhuma forma de se recuperar. Como fazemos o computador tomar decisões — permitindo o pulo **apenas se** o herói estiver vivo, e adicionando um botão de cura?

Vamos refatorar o arquivo `index.html` que criamos na Aula 001 utilizando **Estruturas Condicionais (`if` / `else`)**, **Operadores Lógicos** e o nosso primeiro botão!

---

### 2. `glossario.tech` (Novidades da Aula 002)

> 💡 *Nota: Consulte os glossários anteriores sempre que precisar relembrar tags, propriedades ou comandos já ensinados.*

#### 🧱 HTML (Esqueleto)
* **`<button>`**: A tag nativa para criar um botão clicável na tela.
* **`disabled`**: Atributo HTML que "desativa" um botão, impedindo o clique do jogador.

#### 🎨 CSS (Aparência e Estilo)
* **`#id:hover`**: Regra de estilo ativada quando o ponteiro do mouse passa por cima do elemento.
* **`#id:disabled`**: Estilização especial para quando um botão estiver desativado (ex: ficar cinza e opaco).
* **`gap`**: Espaçamento automático entre elementos dentro de uma caixa organizadora (`flex`).

#### 🧠 JavaScript (Cérebro e Lógica)
* **`if (condicao) { ... }`**: A estrutura de decisão (*Se*). Só executa o bloco se a condição for verdadeira.
* **`else { ... }`**: O complemento (*Senão*). Executa um código alternativo caso o `if` seja falso.
* **`>` / `<` / `<=` / `>=`**: Operadores de comparação (Maior que, Menor que, Menor ou igual, Maior ou igual).
* **`===`**: Operador de igualdade estrita (*É exatamente igual a?*).
* **`+=` / `-=`**: Atalhos matemáticos. `vida += 20` é o mesmo que `vida = vida + 20`.
* **`.disabled = true / false`**: Comando JS para ativar ou desativar um botão do HTML em tempo de execução.

---

### 3. Passo a Passo da Refatoração

Abra o arquivo `index.html` e aplique os ajustes usando os blocos de código abaixo como referência.

#### Passo 1: Atualizando a Interface e Estilos
Vamos alterar o CSS da nossa `#hud` para usar a propriedade `gap` (que separa o texto do botão) e criar os estilos do botão de cura.

No seu `<style>`, atualize o bloco da `#hud` e insira as novas regras logo abaixo:

```css
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

    #hud {
      margin-bottom: 15px;
      font-size: 1.2rem;
      display: flex;
      gap: 15px;
      align-items: center;
    }

    #btn-curar {
      background-color: #04d361;
      color: #000000;
      border: none;
      padding: 8px 16px;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    #btn-curar:hover {
      background-color: #00b352;
    }

    #btn-curar:disabled {
      background-color: #41414d;
      color: #7c7c8a;
      cursor: not-allowed;
    }

    #arena {
      width: 600px;
      height: 300px;
```

#### Passo 2: Adicionando o Botão de Cura no HTML
Agora colocaremos o botão físico na tela do jogador.

Na sua <div id="hud">, insira a nova tag <button> ao lado do <span>:

```HTML
<body>

  <div id="hud">
    <span>Vida do Herói: <strong id="texto-vida">100</strong> HP</span>
    <button id="btn-curar" onclick="curarHeroi()">Usar Poção (+25 HP)</button>
  </div>

  <div id="arena">
```

#### Passo 3: Refatorando a Lógica no JavaScript
Vamos abraçar a ação do pulo com uma trava if (vida > 0). Se a vida for 0, o código cai no else e impede que o herói continue pulando. Também adicionaremos a função curarHeroi().

No seu <script>, substitua o bloco existente pelas novas validações:

```JavaScript
  <script>
    let vida = 100;
    let maxVida = 100;
    let posicaoY = 20;

    function executarPuloSuicida() {
      if (vida > 0) {
        let elementoHeroi = document.getElementById("heroi");
        let elementoTextoVida = document.getElementById("texto-vida");

        posicaoY = 100;
        elementoHeroi.style.bottom = posicaoY + "px";
        
        vida -= 25;

        if (vida <= 0) {
          vida = 0;
          elementoHeroi.style.backgroundColor = "#e83f5b";
          document.getElementById("btn-curar").disabled = true;
          alert("☠️ Game Over! O Herói morreu e não pode mais pular nem se curar.");
        }

        elementoTextoVida.innerText = vida;

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

    function curarHeroi() {
      if (vida > 0 && vida < maxVida) {
        vida += 25;

        if (vida > maxVida) {
          vida = maxVida;
        }

        document.getElementById("texto-vida").innerText = vida;
        console.log("💚 Herói curado! HP atual: " + vida);
      }
    }
  </script>
```

##### Caso tenha ficado com alguma duvida, compare o seu arquivo final com o arquivo final da aula.

### 4. Desafio Prático
Abra o seu arquivo index.html modificado no navegador e tente fazer estas edições:

Mude a variável maxVida para 150 e a vida inicial para 150.

Altere a função curarHeroi() para recuperar apenas 10 de HP por clique (vida += 10).

Tente criar um segundo botão no HTML que enche a vida toda do herói de uma vez só!

### 5.🔥 Aprofundamento Hardcore (Bastidores da Engenharia)

#### A- Avaliação Curto-Circuito (Short-Circuit Evaluation)
Na função de cura, usamos a expressão if (vida > 0 && vida < maxVida). O operador lógico && (E) utiliza uma otimização no motor JS chamada Curto-Circuito: se a primeira condição (vida > 0) for falsa, o navegador nem perde tempo avaliando a segunda parte (vida < maxVida). O código pula o bloco imediatamente, economizando ciclos de processamento.

#### B- O Estado no DOM vs. O Estado na Memória JS
A variável maxVida controla as regras do jogo na memória RAM. O texto <strong id="texto-vida"> é apenas um reflexo visual. Tentar controlar a regra lendo o texto desenhado na tela (innerText) é uma péssima prática chamada de DOM-driven state. No codeBase, mantemos a Fonte Única da Verdade (Single Source of Truth) sempre em variáveis JavaScript.

#### C- A Árvore de Eventos e a Propriedade disabled
Quando definimos btnCurar.disabled = true, o navegador remove o nó dos ouvintes do manipulador de eventos de clique no nível da Render Tree. Isso garante que, mesmo se um usuário tentar disparar a função de cura pelo console do navegador, a checagem interna if (vida > 0) impedirá a execução do código de forma totalmente segura.
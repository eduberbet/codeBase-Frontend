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

### 2. CONDICIONAIS — O Primeiro Cérebro do seu Jogo

Lembra na **Aula 001** quando dissemos que o HTML e o CSS são assistentes passivos que não pensam, e que só o JavaScript é a linguagem de programação de verdade porque consegue tomar decisões?

Hoje vamos dar ao seu jogo o primeiro "cérebro" real! Vamos ensinar o programa a tomar uma decisão fundamental de qualquer jogo 2D: **SE a vida do Herói chegar a zero, ENTÃO é Game Over; SENÃO, ele continua vivo!**

Por padrão, a execução de um código de computador funciona em **ordem sequencial** — exatamente como você lendo um livro ou uma notícia: linha por linha, de cima para baixo. Quando colocamos uma **condicional**, nós interrompemos essa leitura reta e criamos desvios no caminho (chamados de *bifurcações* ou *estruturas de controle*).

No JavaScript, fazemos isso principalmente de duas formas básicas:

#### 🧱 A Condicional Simples: `if (condição) { o que fazer }`
Neste caso, o bloco de código só é executado **SE** a condição for verdadeira (*true*). Se a condição for falsa (*false*), o JavaScript simplesmente ignora o bloco entre chaves e continua lendo o código normalmente nas linhas de baixo.

#### 🔀 A Condicional Composta: `if (condição) { o que fazer } else { faz outra coisa }`
Aqui o fluxo ganha dois caminhos possíveis. Caso a condição seja **verdadeira**, o JavaScript executa o bloco `o que fazer` e **ignora totalmente** o `faz outra coisa`. Se a condição for **falsa**, acontece exatamente o contrário: o primeiro bloco é ignorado e o JavaScript executa direto o `faz outra coisa`.

#### ⏳ Outros casos mais complexos:
Por hoje, dominar essa ideia de `if` e `else` é mais do que suficiente! Releia, pratique o código no seu editor e fixe o conceito. Nas próximas aulas, conforme o nosso Herói ganhar novas habilidades, apresentaremos lógicas de condicionais mais avançadas (como testar várias condições ao mesmo tempo).

---

### 3. `glossario.tech` (Novidades da Aula 002)

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

### 4. Passo a Passo da Refatoração

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

### 5. Desafio Prático
Abra o seu arquivo index.html modificado no navegador e tente fazer estas edições:

Mude a variável maxVida para 150 e a vida inicial para 150.

Altere a função curarHeroi() para recuperar apenas 10 de HP por clique (vida += 10).

Tente criar um segundo botão no HTML que enche a vida toda do herói de uma vez só!

### 6. 🔥 Aprofundamento Hardcore (Bastidores da Engenharia)

#### A - Tipagem Dinâmica e Coerção de Tipos (*Type Coercion*)
No JavaScript, variáveis criadas com `let` não possuem um tipo fixo atrelado à sua declaração — o tipo pertence ao **valor** guardado na memória RAM. 
* **Coerção Implícita:** Quando fazemos `"HP: " + vida`, o motor do JS percebe a presença da string e converte o número `vida` em texto automaticamente para concatenar.
* **O Perigo das Operações:** Se tentarmos somar `let vida = "100" + 25`, o JS gera `"10025"` (texto), enquanto `"100" - 25` resulta em `75` (número). Garantir que variáveis numéricas guardem tipos `Number` puros é essencial para evitar o "Bug da Vida Infinita".

#### B - Operadores Lógicos e Avaliação Curto-Circuito (*Short-Circuit Evaluation*)
Ao validar a cura com `if (vida > 0 && vida < maxVida)`, usamos o operador lógico `&&` (E Lógico). 
O motor JS otimiza essa checagem na memória através do **Curto-Circuito**: se a primeira expressão (`vida > 0`) for avaliada como `false`, o processador interrompe a leitura e **nem perde tempo avaliando a segunda parte** (`vida < maxVida`). O bloco é ignorado instantaneamente, economizando ciclos de processamento na CPU.

#### C - O Estado na Memória JS vs. O Estado no DOM
As variáveis `vida` e `maxVida` mantêm as regras de negócio puras na memória RAM. A tag `<span id="texto-vida">` é apenas um reflexo visual para o jogador. 
Tentar controlar o estado do jogo lendo o texto exibido na tela (`innerText`) é uma péssima prática conhecida como *DOM-driven state*. No **codeBase**, aplicamos o padrão de engenharia da **Fonte Única da Verdade** (*Single Source of Truth - SSOT*): a lógica reside 100% no JavaScript, e o DOM apenas obedece.

#### D - A Árvore de Eventos e a Propriedade `disabled`
Quando executamos `btnCurar.disabled = true`, o navegador desativa visualmente o botão e bloqueia a emissão de eventos de clique no nível da *Render Tree*. 
Contudo, um jogador mal-intencionado poderia tentar invocar a função `curarHeroi()` diretamente pelo Console do Desenvolvedor. Por isso, a trava de segurança dupla com o `if (vida > 0)` dentro da função JS garante que a regra seja respeitada mesmo sob tentativas de manipulação externa.
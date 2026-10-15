# codeBase: Frontend (`codeBase-frontend`)
## Aula 004 — Modularização de Arquivos e Identificação do Herói

---

### 1. Introdução: Quase 200 Linhas de Código... E Agora?

Seja bem-vindo de volta ao **`codeBase-frontend`**! 

Dê uma olhada rápida no seu arquivo `index.html` da Aula 003. Percebeu algo incomum? Temos a estrutura da página, as regras visuais de CSS e a lógica de JavaScript **tudo dentro de um único arquivo!** 

Já estamos batendo quase **200 linhas de código**. Imagina quando o nosso jogo tiver 4 tipos de Boss, sistema de arco e flecha, caixa de poção, animações complexas e atalhos de teclado... O seu arquivo teria 3.000 linhas e você passaria mais tempo rolando a tela para achar uma função do que programando de fato.

Trabalhar assim é o equivalente a guardar roupas, talheres, ferramentas e comida **tudo dentro da mesma gaveta**. Funciona? Até funciona. Mas achar qualquer coisa ali vira um pesadelo!

Hoje, vamos resolver isso como programadores de verdade:
1. **Fase 1 (Limpeza e Modularização):** Vamos fatiar o nosso arquivo gigante em três arquivos especializados (`index.html`, `style.css` e `script.js`).
2. **Fase 2 (Verificação Segura):** Vamos testar para garantir que o jogo continua funcionando exatamente igual.
3. **Fase 3 (Nova Funcionalidade):** Adicionaremos uma caixa de texto (`<input>`) para personalizar o nome do nosso Herói!

---
### 2. Por que dividir em vários arquivos? (SPOILER: O Computador Não Liga!)
Vamos fazer a nossa primeira grande refatoração de arquitetura: vamos pegar aquele arquivo único e separar em três arquivos especializados: `index.html`, `style.css` e `script.js`.

Mas antes de movermos qualquer linha, vale a pena revelar um segredo dos bastidores da tecnologia:

> 🤫 **A Verdade Nu e Crua:** Para o processador do seu computador ou para o navegador, ter 1.000 linhas de código dentro de um único arquivo `.html` ou dividir essas mesmas 1.000 linhas em três arquivos separados faz **ZERO diferença**. 
>
> O motor do navegador vai ler tudo, juntar na memória RAM e executar exatamente com a mesma velocidade!

#### Então por que todo o mercado profissional divide os arquivos?

Porque **código não é escrito apenas para computadores executarem; código é escrito para SERES HUMANOS lerem, entenderem e darem manutenção!**

Imagine a sua casa:
* **O Arquivo Único (A MUDANÇA DA BAGUNÇA):** É como jogar suas roupas, talheres, ferramentas e livros todos juntos dentro de uma única caixa de papelão gigante. Funciona? Funciona. Mas o dia em que você precisar trocar só o garfo, vai ter que revirar a caixa inteira.
* **Os Arquivos Especializados (A CASA ORGANIZADA):** 
  * O `index.html` vira a **Estrutura** (a planta da casa / o esqueleto do herói).
  * O `style.css` vira a **Decoração** (a tinta das paredes / as cores da arena).
  * O `script.js` vira o **Sistema Elétrico e Automação** (os motores / o cérebro que faz tudo funcionar).

Quando o seu jogo crescer e tiver 5.000 linhas, se você quiser mudar a cor de um botão, você vai direto no arquivo de estilo (`style.css`), sem o risco de apagar por acidente uma linha vital da lógica do jogo (`script.js`).

Isso em engenharia de software é o primeiro passo para o princípio de **Separação de Responsabilidades (Separation of Concerns)**. 

**Nota do Sensei:** Há também outras utilidades de dividir em mais de um arquivo, mas vamos retomar este assunto no futuro! Conforme o nosso jogo ficar mais robusto, veremos como separar até mesmo o próprio arquivo `script.js` em arquivos menores (como um `funcoes.js` ou `fisica.js`). Isso nos permitirá criar blocos de código independentes e reutilizáveis — o mesmo princípio usado para criar grandes bibliotecas e frameworks no mercado

---

### 3. `glossario.tech` (Novidades da Aula 004)

> 💡 *Nota: Consulte os glossários das anteriores sempre que precisar relembrar conceitos ja abordados*

#### 🧱 HTML (Esqueleto)
* **`<link rel="stylesheet" href="...">`**: Tag responsável por "importar" uma folha de estilos CSS externa para dentro do seu HTML.
* **`<script src="..."></script>`**: Tag responsável por importar e executar um arquivo JavaScript externo.
* **`<input type="text">`**: Componente padrão de formulário que cria uma caixa para o usuário digitar textos livres.

#### 🎨 CSS (Aparência e Estilo)
* **Separacao de Folha Esterna**: Mover todas as regras contidas dentro da tag `<style>` para um arquivo `.css` próprio, eliminando a necessidade da tag `<style>`.

#### 🧠 JavaScript (Cérebro e Lógica)
* **`.value`**: Propriedade usada no JS para capturar exatamente o texto que o usuário digitou dentro de um campo `<input>`.
* **`.trim()`**: Método de texto que remove espaços em branco inúteis deixados no início ou no final de uma palavra digitada pelo usuário.

---

### 4. Passo a Passo da Refatoração

---

#### FASE 1: Criando a Trinca da Web (Divisão de Arquivos)

Na mesma pasta do seu projeto, crie dois novos arquivos em branco:
1. `style.css`
2. `script.js`

##### Passo 1.1: Recortando o CSS
1. Abra o seu `index.html`.
2. Recorte **todo o conteúdo** que está **dentro** da tag `<style>` (não recorte a tag `<style>` em si ainda, apenas as regras CSS que estão entre `<style>` e `</style>`).
3. Cole todo esse código dentro do arquivo `style.css` e salve.
4. Volte no `index.html`, apague as tags `<style>` e `</style>` que ficaram vazias e insira a tag de importação no `<head>`:

```html
<head>
  <meta charset="UTF-8">
  <title>codeBase - Aula 004: Modularização e Nome do Herói</title>
  <!-- NOVO: Conecta a folha de estilos externa -->
  <link rel="stylesheet" href="style.css">
</head>
```
##### Passo 1.2: Recortando o JavaScript
No seu index.html, recorte todo o conteúdo que está dentro da tag <script> (não recorte as tags de abertura e fechamento).

Cole todo esse código dentro do arquivo script.js e salve.

Volte no index.html, apague as antigas tags <script> e substitua por:
```html
HTML
  <!-- NOVO: Importa e executa o script externo no final do body -->
  <script src="script.js"></script>
</body>
```
#### FASE 2: Teste do Desenvolvedor & SAC de Erros (Troubleshooting)
Abra o seu index.html no navegador e dê alguns cliques no herói e na poção. O jogo precisa funcionar exatamente da mesma forma que funcionava na Aula 003!

##### 🆘 SAC dos Erros Comuns nesta Etapa:
###### 🚨 Erro 1: "Minha página perdeu todas as cores e ficou toda quebrada!"

Causa: O caminho ou o nome do arquivo no <link> está errado.

Solução: Verifique se o seu arquivo se chama exatamente style.css e se a tag no HTML está <link rel="stylesheet" href="style.css">. Note que a extensão é .css e não .html.

###### 🚨 Erro 2: "Clico na bolinha para pular ou na poção para curar e NADA acontece!"

Causa: O navegador não conseguiu carregar o arquivo script.js.

Solução: Abra o Console do Navegador (pressione a tecla F12 e clique na aba Console). Se você vir uma mensagem em vermelho dizendo GET file:///.../script.js net::ERR_FILE_NOT_FOUND, o nome do arquivo foi digitado errado na tag <script src="script.js"></script>.

###### 🚨 Erro 3: "Aparecem as tags <style> ou <script> escritas na tela como texto!"

Causa: Você copiou as tags HTML de abertura e fechamento para dentro dos arquivos .css ou .js.

Solução: Lembre-se: arquivos .css só entendem regras CSS! Arquivos .js só entendem código JavaScript! NENHUM dos dois deve conter tags HTML como <style> ou <script>.

#### FASE 3: Adicionando o Formulário do Nome do Herói
Agora que o nosso código está organizado e validado, vamos adicionar a nossa nova feature: o campo para o jogador registrar o nome do Herói.

##### Passo 3.1: Atualizando o HTML (index.html)
No index.html, adicione o painel do formulário logo acima da <div id="hud">:

```html
HTML
<body>

  <!-- NOVO: Painel de Identificação do Jogador -->
  <div id="painel-inicial">
    <label for="input-nome">Nome do Herói:</label>
    <input type="text" id="input-nome" placeholder="Digite o nome..." value="Valente">
    <button id="btn-iniciar" onclick="confirmarNome()">Confirmar Nome</button>
  </div>

  <div id="hud">
    <!-- NOVO: Rótulo para exibir o nome personalizado do herói -->
    <span id="label-heroi">Herói: Valente</span>
    <div id="barra-container">
      <div id="barra-vida"></div>
    </div>
    <button id="btn-curar" onclick="curarHeroi()">Usar Poção (+25 HP)</button>
  </div>
```
##### Passo 3.2: Estilizando o Painel no CSS (style.css)
No arquivo style.css, insira os estilos visuais para o formulário no topo das regras do HUD:
```css
CSS
/* NOVO: Estilização do formulário inicial */
#painel-inicial {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
  align-items: center;
  background-color: #202024;
  padding: 10px 20px;
  border-radius: 6px;
  border: 1px solid #41414d;
}

#input-nome {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #7c7c8a;
  background-color: #121214;
  color: #ffffff;
}

#hud {
  margin-bottom: 15px;
  font-size: 1.1rem;
  display: flex;
  gap: 15px;
  align-items: center;
}
```

##### Passo 3.3: Lendo o Input no JavaScript (script.js)
No arquivo script.js, vamos criar a variável nomeHeroi para guardar o nome e a função confirmarNome() para ler o texto digitado pelo jogador:

```javascript
JavaScript
// ESTADO DO JOGO EM VARIÁVEIS
let nomeHeroi = "Valente"; // NOVO: Armazena o nome retido na memória
let vida = 100;
let maxVida = 100;
let posicaoY = 20;

// NOVA FUNÇÃO: Captura o valor do <input> e atualiza a interface
function confirmarNome() {
  let inputElemento = document.getElementById("input-nome");
  
  // O .trim() remove espaços vazios acidentais
  if (inputElemento.value.trim() !== "") {
    nomeHeroi = inputElemento.value.trim();
    document.getElementById("label-heroi").innerText = "Herói: " + nomeHeroi;
    console.log("👤 Nome do Herói alterado para: " + nomeHeroi);
  }
}
```
E finalmente, altere o alerta de morte no script.js para usar o nome do Herói:
```javascript
JavaScript
        if (vida <= 0) {
          vida = 0;
          elementoHeroi.style.backgroundColor = "#e83f5b";
          document.getElementById("btn-curar").disabled = true;
          // NOVO: Mensagem usando a variável nomeHeroi
          alert("☠️ Game Over! " + nomeHeroi + " morreu e não pode mais pular nem se curar.");
        }
```
### 5. Desafio Prático
No script.js, altere as mensagens de console.log da cura para que ela também exiba o nome do Herói (Ex: console.log("💚 " + nomeHeroi + " foi curado!")).

Tente alterar o CSS do #input-nome para adicionar um efeito de destaque amarelado na borda quando o usuário clicar para digitar (#input-nome:focus { border-color: #fba94c; outline: none; }).

### 🔥 Aprofundamento Hardcore (Bastidores da Engenharia)

#### A - O Bloqueio de Renderização pelo CSS (Render-Blocking Resources) e o FOUC
Quando o navegador baixa o index.html e encontra a tag <link rel="stylesheet">, ele interrompe a montagem visual da tela (Critical Rendering Path) até que o arquivo style.css seja totalmente baixado e interpretado. O navegador faz isso para evitar o efeito indesejado conhecido como FOUC (Flash of Unstyled Content), no qual a página aparece por meio segundo em texto bruto e sem cores antes de aplicar a folha de estilos.

#### B - O Ciclo do DOM, a Posição do Script e o Atributo defer
O navegador lê o arquivo HTML de cima para baixo, linha por linha. Se colocássemos o <script src="script.js"> dentro do <head> de forma síncrona, o JavaScript seria executado antes da criação das tags <div id="heroi"> ou <input id="input-nome">. O document.getElementById() retornaria null, quebrando o jogo.

- Solução Clássica: Colocar o <script> no final do <body> garante que todo o DOM já está construído e pronto na memória RAM.

- Solução Moderna (defer): Ao usar <script src="script.js" defer> no <head>, instruímos o navegador a baixar o arquivo JavaScript em paralelo (sem bloquear a leitura do HTML) e executá-lo automaticamente apenas quando o DOM estiver 100% carregado.

#### C - Atributo HTML (Initial State) vs. Propriedade DOM (.value)
Existe uma diferença sutil, mas vital, entre o HTML estático e o objeto no JavaScript:

- O atributo value="..." escrito no arquivo HTML representa apenas o valor padrão inicial na carga da página.

- Quando o usuário digita na caixa de texto, o código HTML original não se altera. O que muda em tempo real é a propriedade .value do nó correspondente mantido no objeto DOM na memória RAM pelo motor JS.

#### D - Escopo Global vs. Escopo de Bloco (var vs. let / const)
No JavaScript clássico, variáveis declaradas com var possuem escopo de função ou sobem para o Escopo Global (window), podendo ser sobrescritas acidentalmente por outros scripts. Já com as palavras-chave let e const (introduzidas no ES6), o JavaScript adota o Escopo de Bloco: a variável existe estritamente dentro das chaves { ... } onde foi criada. Isso impede vazamento de dados e garante que o nome do jogador ou o estado da vida não sejam corrompidos por blocos vizinhos.

const questions = [
    { answer: "CPU", statement: "Componente do computador responsável por buscar, decodificar e executar instruções vindas da memória do computador." },
    { answer: "ULA", statement: "Unidade central de qualquer microprocessador responsável por executar operações aritméticas e lógicas." },
    { answer: "REGISTRADORES", statement: "Categoria de memória localizada dentro da CPU que lidera a hierarquia das memórias, sendo extremamente pequena e rápida." },
    { answer: "RAM", statement: "Categoria de memória volátil que possui acesso direto à CPU e funciona como bancada de trabalho do computador." },
    { answer: "ROM", statement: "Categoria de memória pré-programada utilizada para armazenar firmwares e softwares imutáveis como a BIOS." },
    { answer: "EPROM", statement: "Categoria de memória ROM não volátil que pode ser reprogramada através de luz ultravioleta." },
    { answer: "FLASH", statement: "Categoria de memória não volátil utilizada em SSDs e pen drives por oferecer alta velocidade e durabilidade." },
    { answer: "MEMORIADEMASSA", statement: "Categoria de armazenamento não volátil responsável por guardar permanentemente grandes quantidades de dados." },
    { answer: "DMA", statement: "Tecnologia que permite dispositivos de entrada e saída acessarem diretamente a memória RAM sem passar pela CPU." },
    { answer: "CS", statement: "Pino de controle responsável por ativar ou desativar chips específicos em um sistema." },
    { answer: "ADDRESSBUS", statement: "Categoria de barramento responsável por transmitir endereços de memória para leitura ou gravação de dados (em inglês)." },
    { answer: "DATABUS", statement: "Categoria de barramento responsável por transmitir dados entre os componentes do computador (em inglês)." },
    { answer: "I5", statement: "Nome da linha intermediária de microprocessadores da Intel." },
    { answer: "I7", statement: "Nome da linha de ponta de microprocessadores da Intel." },
    { answer: "DUALCORE", statement: "Tecnologia de microprocessadores onde dois núcleos físicos compartilham recursos para melhorar o desempenho." },
    { answer: "QUADCORE", statement: "Tecnologia de microprocessadores onde quatro núcleos físicos compartilham recursos para melhorar o desempenho." },
];

const allowedCharacters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ57"];

function generateTermo(question, numTries) {
    const {answer, statement} = question;

    if(typeof answer !== "string" || typeof statement !== "string") return;
    if(numTries <= 0) return;
    
    const termoGrid = document.getElementById("termo");
    if(!termoGrid) return;
    termoGrid.innerHTML = "";


    generateStatement(termoGrid, statement);
    for (let i = 0; i < numTries; i++) {
        generateRow(termoGrid, (i+1), answer.length);    
    }

    // Seleciona primeira div.letter
    const firstSelected = document.querySelector(`
        .letter[data-letter-position='0'][data-num-trie='1'][aria-disabled='false']
    `);
    firstSelected.classList.add("letter--selected");
}

function generateStatement(grid, statement) {
    const statementDiv = document.createElement("div");
    statementDiv.classList.add("statement");
    statementDiv.innerHTML = `<p>Pergunta:</p><q>${statement}</q>`;
    
    grid.appendChild(statementDiv);
}

function generateRow(grid, numTrie, size) {
    if(typeof size !== "number") return;

    const row = document.createElement("div");
    row.classList.add("row");

    for (let i = 0; i < size; i++) {
        const letterEl = document.createElement("input");
        
        // Configurações da Input
        letterEl.classList.add("letter");
        letterEl.name = "ipt-letter";
        letterEl.type = "text";
        letterEl.autocomplete = "off";
        letterEl.minLength = 1;
        letterEl.maxLength = 1;
        letterEl.disabled = true;

        letterEl.dataset.letterPosition = i;
        letterEl.dataset.numTrie = numTrie;
        letterEl.ariaDisabled = numTrie === 1 ? "false" : "true";

        row.appendChild(letterEl);        
    }

    grid.appendChild(row);
}

function generateKeyboard(word) {
    const keyboardDiv = document.getElementById("keyboard");
    if(!keyboardDiv) return;

    allowedCharacters.forEach((char) => {
        const letter = document.createElement("button");

        letter.innerHTML = char;
        letter.classList.add("letter");
        letter.dataset.charValue = char;
        letter.onclick = (ev) => typeAction(ev, false);

        keyboardDiv.appendChild(letter);
    });

    // Backspace Letter
    const backspaceLetter = document.createElement("button");
    backspaceLetter.classList.add("letter");
    backspaceLetter.innerHTML = `<i class="fa-solid fa-delete-left"></i>`;
    backspaceLetter.onclick = (ev) => backspaceAction(ev);
    keyboardDiv.appendChild(backspaceLetter);
    
    // Enter Letter
    const enterLetter = document.createElement("button");
    enterLetter.classList.add("letter", "letter--wide");
    enterLetter.innerHTML = `ENTER`;
    enterLetter.onclick = (ev) => enterAction(ev);
    keyboardDiv.appendChild(enterLetter);
}

function backspaceAction(event) {
    const letterEl = document.querySelector(`.letter--selected`);
    if(!letterEl) return;
    const letterPos = Number(letterEl.dataset.letterPosition);

    if(letterEl.value) {
        letterEl.value = null;
        return;
    };
    
    const prev = document.querySelector(`.letter[data-letter-position="${letterPos-1}"]`);
    if(!prev) return;
    
    event.preventDefault();
    toggleSelectedElement(letterEl, prev);
}

function typeAction(event, fromClick = true) {
    const letterEl = document.querySelector(`.letter--selected`);
    if(!letterEl) return;
    const letterPos = Number(letterEl.dataset.letterPosition);

    if(fromClick) {
        letterEl.value = event.key.toUpperCase();
    } else {
        letterEl.value = event.target.dataset.charValue;
    }
    
    const next = document.querySelector(`.letter[data-letter-position="${letterPos+1}"]`);
    if(!next) return;
    
    event.preventDefault();
    toggleSelectedElement(letterEl, next);
}

function enterAction() {console.log("submit!")}

function toggleSelectedElement(oldEl, newEl) {
    oldEl.classList.remove("letter--selected");
    newEl.classList.add("letter--selected");
}
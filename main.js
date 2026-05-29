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

// === FUNÇÕES DE LOOP DA GAMEPLAY === //
function startGame() {
    currentTrie = 1;

    const dificulty = document.getElementById("ipt-dificulty")?.value || "normal";
    const numTries = dificultyToNumTries[dificulty];

    randomizeQuestion();
    generateTermo(currentQuestion, numTries);
    generateKeyboard();

    const quizProgress = document.getElementById("quiz-progress");
    if(!quizProgress) return;
    quizProgress.innerHTML = `${questions.length - questionsToShow.length}/${questions.length}`;
}

function resetGame() {
    questionsToShow = [...questions];
    qtdAcertos = 0;
    qtdErros = 0;

    updateScore();
    startGame();
}

// === FUNÇÕES GENERATE === //
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

    // Seleciona primeira div.cell
    const firstSelected = document.querySelector(`
        .row[data-num-trie="${currentTrie}"] .cell[data-letter-position="0"]
    `);
    firstSelected.classList.add("cell--selected");
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
    if(numTrie !== 1) {
        row.classList.add("row--blocked");
    }
    row.dataset.numTrie = numTrie;

    for (let i = 0; i < size; i++) {
        generateCell(row, i);
    }

    grid.appendChild(row);
}

function generateCell(row, position) {
    const cellEl = document.createElement("input");
    
    cellEl.classList.add("cell");
    cellEl.name = "ipt-letter";
    cellEl.type = "text";
    cellEl.autocomplete = "off";
    cellEl.minLength = 1;
    cellEl.maxLength = 1;
    cellEl.disabled = true;

    cellEl.dataset.letterPosition = position;

    row.appendChild(cellEl);
}

function generateKeyboard() {
    const keyboardDiv = document.getElementById("keyboard");
    if(!keyboardDiv) return;
    keyboardDiv.innerHTML = "";

    allowedCharacters.forEach((char) => {
        const cell = document.createElement("button");

        cell.innerHTML = char;
        cell.classList.add("cell");
        cell.dataset.charValue = char;
        cell.onclick = (ev) => typeAction(ev, false);

        keyboardDiv.appendChild(cell);
    });

    // Backspace Cell
    const backspaceCell = document.createElement("button");
    backspaceCell.classList.add("cell");
    backspaceCell.innerHTML = `<i class="fa-solid fa-delete-left"></i>`;
    backspaceCell.onclick = (ev) => backspaceAction(ev);
    keyboardDiv.appendChild(backspaceCell);
    
    // Enter Cell
    const enterCell = document.createElement("button");
    enterCell.classList.add("cell", "cell--wide");
    enterCell.innerHTML = `ENTER`;
    enterCell.onclick = (ev) => enterAction(ev, currentQuestion.answer);
    keyboardDiv.appendChild(enterCell);
}


// === FUNÇÕES DE AÇÃO === //
function backspaceAction(event) {
    event.preventDefault();

    const cellEl = document.querySelector(`.cell--selected`);
    if(!cellEl) return;
    const letterPos = Number(cellEl.dataset.letterPosition);

    if(cellEl.value) {
        cellEl.value = null;
        return;
    };
    
    const prev = document.querySelector(`.row[data-num-trie="${currentTrie}"] .cell[data-letter-position="${letterPos-1}"]`);
    if(!prev) return;
    
    toggleSelectedCell(cellEl, prev);
}

function typeAction(event, fromClick = true) {
    event.preventDefault();

    const cellEl = document.querySelector(`.cell--selected`);
    if(!cellEl) return;
    const letterPos = Number(cellEl.dataset.letterPosition);

    if(fromClick) {
        cellEl.value = event.key.toUpperCase();
    } else {
        cellEl.value = event.target.dataset.charValue;
    }
    
    const next = document.querySelector(`.row[data-num-trie="${currentTrie}"] .cell[data-letter-position="${letterPos+1}"]`);
    if(!next) return;
    
    toggleSelectedCell(cellEl, next);
}

function enterAction(event, currentWord) {
    event.preventDefault();

    if(typeof currentWord !== "string") return;
    const wordArray = [...currentWord];

    const currentRow = document.querySelector(`.row[data-num-trie="${currentTrie}"]`);
    if(!currentRow) return;

    const activeCells = currentRow.querySelectorAll(".cell");
    if(!activeCells || activeCells.length !== wordArray.length) return;

    const isIncomplete = Array.from(activeCells).some((cell) => !cell.value);
    if(isIncomplete) {
        wiggleAnimation(currentRow);
        return;
    }
    
    const rightPos = [];
    const wrongPos = [];
    const wrongLetter = [];
    Array.from(activeCells).forEach((cell, idx) => {
        const letter = cell.value;

        // 1. checando letras inexistentes na palavra original
        if(!wordArray.includes(letter)) {
            wrongLetter.push(letter);
            cell.classList.add("cell--wrongLetter");
            
            return;
        };
        
        // 2. Checando posições
        const pair = wordArray[idx];
        if(letter === pair) {
            rightPos.push(letter);
            cell.classList.add("cell--rightPos");
        } else {
            wrongPos.push(letter);
            cell.classList.add("cell--wrongPos");
        }
    });

    // Checa se é a última row
    const nextRow = document.querySelector(`.row[data-num-trie="${currentTrie + 1}"]`);
    if(!nextRow || rightPos.length === wordArray.length) {
        advanceQuestion();
        return;
    } else {   
        currentRow.classList.add("row--blocked");
        nextRow.classList.remove("row--blocked");

        const oldSelected = document.querySelector(".cell--selected");
        const newSelected = nextRow.querySelector(`
            .cell[data-letter-position="0"]
        `);

        currentTrie++;
        toggleSelectedCell(oldSelected, newSelected);
    }

    updateKeyboard(rightPos, wrongPos, wrongLetter);
}

function updateKeyboard(rightPos, wrongPos, wrongLetter) {
    const keyboardDiv = document.getElementById("keyboard");
    if(!keyboardDiv) return;

    keyboardDiv.querySelectorAll(".cell[data-char-value]").forEach((cell) => {
        const charValue = cell.dataset.charValue;
        if(!charValue) return;

        if(rightPos.includes(charValue)) {
            cell.classList.add("cell--rightPos");
        } else if(wrongPos.includes(charValue)) {
            cell.classList.add("cell--wrongPos");
        } else if(wrongLetter.includes(charValue)) {
            cell.classList.add("cell--wrongLetter");
        }
    });
}

function advanceQuestion() {
    const selectedCell = document.querySelector(".cell--selected");
    if(!selectedCell) return;
    selectedCell.classList.remove("cell--selected");

    const currentRow = document.querySelector(`.row[data-num-trie="${currentTrie}"]`);
    if(!currentRow) return;
    const allRight = Array.from(currentRow.querySelectorAll(".cell"))
        .every(cell => cell.classList.contains("cell--rightPos"));

    if(allRight) {
        qtdAcertos++;
    } else {
        qtdErros++;
    }
    updateScore();

    const statementDiv = document.querySelector("#termo .statement");
    if(!statementDiv) return;

    const advanceBtn = document.createElement("button");
    advanceBtn.classList.add("advance-btn");
    advanceBtn.innerHTML = `<i class="fa-solid ${questionsToShow.length > 0 ? "fa-arrow-right" : "fa-arrow-rotate-right"}"></i>`;
    advanceBtn.onclick = () => {
        if(questionsToShow.length > 0) {
            startGame();
        } else {
            resetGame();
        }
    };

    statementDiv.appendChild(advanceBtn);
}

// === FUNÇÕES UTILITÁRIAS === //
function toggleSelectedCell(oldEl, newEl) {
    oldEl.classList.remove("cell--selected");
    newEl.classList.add("cell--selected");
}

function wiggleAnimation(element) {
    if(element.classList.contains("wiggle")) return;
    
    element.classList.add("wiggle");
    setTimeout(() => {
        element.classList.remove("wiggle");
    }, 400);
}

function randomizeQuestion() {
    const questionId = Math.floor(Math.random() * questionsToShow.length);
    currentQuestion = questionsToShow[questionId];

    questionsToShow.splice(questionId, 1);
}

function updateScore() {
    const acertosEl = document.getElementById("quiz-acertos");
    const errosEl = document.getElementById("quiz-erros");
    if(acertosEl) acertosEl.innerHTML = qtdAcertos;
    if(errosEl) errosEl.innerHTML = qtdErros;
}
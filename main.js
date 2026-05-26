const questoesMap = new Map();

function generateTermo(question, numTries) {
    const {answer, statement} = question;

    if(typeof answer !== "string" || typeof statement !== "string") return;
    if(numTries <= 0) return;
    
    const termoGrid = document.getElementById("termo");
    if(!termoGrid) return;
    termoGrid.innerHTML = "";


    generateStatement(termoGrid, statement);
    for (let i = 0; i < numTries; i++) {
        generateRow(termoGrid, answer.length);    
    }
}

function generateStatement(grid, statement) {
    const statementDiv = document.createElement("div");
    statementDiv.classList.add("statement");
    statementDiv.innerHTML = `<p>Pergunta:</p><q>${statement}</q>`;
    
    grid.appendChild(statementDiv);
}

function generateRow(grid, size) {
    if(typeof size !== "number") return;

    const row = document.createElement("div");
    row.classList.add("row");

    for (let i = 0; i < size; i++) {
        const letterEl = document.createElement("input");
        letterEl.classList.add("letter");

        letterEl.name = "ipt-letter";
        letterEl.minLength = 1;
        letterEl.maxLength = 1;
        letterEl.dataset.letterPosition = i;

        letterEl.oninput = (ev) => typeLetter(letterEl, ev);

        row.appendChild(letterEl);        
    }

    grid.appendChild(row);
}

function typeLetter(element, event) {
    element.value = String(event.target.value).toUpperCase();
}

function populateMap() {
    // 1° - CPU
    questoesMap.set(1, {
        statement: "Componente do computador responsável por buscar, decodificar e executar instruções vindas da memória do computador.",
        answer: "CPU"
    });

    // 2° - ULA
    questoesMap.set(2, {
        statement: "Unidade central de qualquer microprocessador responsável por executar operações aritméticas e lógicas.",
        answer: "ULA"
    });
    
    // 3° - Registradores
    questoesMap.set(3, {
        statement: "Categoria de memória localizada dentro da CPU que lidera a hierarquia das memórias, sendo extremamente pequena e rápida.",
        answer: "REGISTRADORES"
    });
    
    // 4° - RAM
    questoesMap.set(4, {
        statement: "Categoria de memória volátil que possui acesso direto à CPU e funciona como bancada de trabalho do computador.",
        answer: "RAM"
    });
    
    // 5° - ROM
    questoesMap.set(5, {
        statement: "Categoria de memória pré-programada utilizada para armazenar firmwares e softwares imutáveis como a BIOS.",
        answer: "ROM"
    });
    
    // 6° - EPROM
    questoesMap.set(6, {
        statement: "Categoria de memória ROM não volátil que pode ser reprogramada através de luz ultravioleta.",
        answer: "EPROM"
    });
    
    // 7° - Memória Flash
    questoesMap.set(7, {
        statement: "Categoria de memória não volátil utilizada em SSDs e pen drives por oferecer alta velocidade e durabilidade.",
        answer: "FLASH"
    });
    
    // 8° - Memória de Massa
    questoesMap.set(8, {
        statement: "Categoria de armazenamento não volátil responsável por guardar permanentemente grandes quantidades de dados.",
        answer: "MEMORIADEMASSA"
    });
    
    // 9° - DMA
    questoesMap.set(9, {
        statement: "Tecnologia que permite dispositivos de entrada e saída acessarem diretamente a memória RAM sem passar pela CPU.",
        answer: "DMA"
    });
    
    // 10° - CS (Chip Select)
    questoesMap.set(10, {
        statement: "Pino de controle responsável por ativar ou desativar chips específicos em um sistema.",
        answer: "CS"
    });
    
    // 11° - Address Bus
    questoesMap.set(11, {
        statement: "Categoria de barramento responsável por transmitir endereços de memória para leitura ou gravação de dados (em inglês).",
        answer: "ADDRESSBUS"
    });
    
    // 12° - Data Bus
    questoesMap.set(12, {
        statement: "Categoria de barramento responsável por transmitir dados entre os componentes do computador (em inglês).",
        answer: "DATABUS"
    });
    
    // 13° - I5
    questoesMap.set(13, {
        statement: "Nome da linha intermediária de microprocessadores da Intel.",
        answer: "I5"
    });
    
    // 14° - I7
    questoesMap.set(14, {
        statement: "Nome da linha de ponta de microprocessadores da Intel.",
        answer: "I7"
    });
    
    // 15° - Dual Core
    questoesMap.set(15, {
        statement: "Tecnologia de microprocessadores onde dois núcleos físicos compartilham recursos para melhorar o desempenho.",
        answer: "DUALCORE"
    });
    
    // 16° - Quad Core
    questoesMap.set(16, {
        statement: "Tecnologia de microprocessadores onde quatro núcleos físicos compartilham recursos para melhorar o desempenho.",
        answer: "QUADCORE"
    });
}